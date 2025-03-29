import { db } from "@/lib/firebase/firebase";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const snapshot = await getDocs(collection(db, "ticket"));

    const tickets = await Promise.all(
      snapshot.docs.map(async (docSnap) => {
        const data = docSnap.data();

        const [
          assistantSnap,
          eventSnap,
          phaseSnap,
          localitySnap,
          promoterSnap,
        ] = await Promise.all([
          getDoc(doc(db, "assistant", data.assistantId)),
          getDoc(doc(db, "event", data.eventId)),
          getDoc(doc(db, "phase", data.phaseId)),
          getDoc(doc(db, "locality", data.localityId)),
          data.promoterId
            ? getDoc(doc(db, "promoter", data.promoterId))
            : Promise.resolve(null),
        ]);

        return {
          id: docSnap.id,
          ticketType: data.ticketType,
          status: data.status,
          emailStatus: data.emailStatus,
          price: data.price,
          qrCode: data.qrCode,
          createdAt: data.createdAt?.toDate?.() ?? null,
          updatedAt: data.updatedAt?.toDate?.() ?? null,
          checkedInAt: data.checkedInAt?.toDate?.() ?? null,

          // Enriquecidos
          assistantName: assistantSnap.exists()
            ? assistantSnap.data().name
            : "—",
          assistantEmail: assistantSnap.exists()
            ? assistantSnap.data().email
            : "—",
          phoneNumber: assistantSnap.exists()
            ? assistantSnap.data().phoneNumber ?? "—"
            : "—",
          identificationNumber: assistantSnap.exists()
            ? assistantSnap.data().identificationNumber ?? "—"
            : "—",

          eventName: eventSnap.exists() ? eventSnap.data().name : "—",
          phaseName: phaseSnap.exists() ? phaseSnap.data().name : "—",
          localityName: localitySnap.exists() ? localitySnap.data().name : "—",
          promoterName: promoterSnap?.exists()
            ? promoterSnap.data().name
            : null,
        };
      })
    );

    return NextResponse.json({ success: true, tickets });
  } catch (error: any) {
    console.error("Error al obtener tickets:", error);
    return NextResponse.json(
      { success: false, error: "Error al obtener tickets" },
      { status: 500 }
    );
  }
}
