import { db } from "@/lib/firebase/firebase";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { NextResponse } from "next/server";

// Endpoint para obtener todos los tickets enriquecidos
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
          ticketTypeSnap,
        ] = await Promise.all([
          getDoc(doc(db, "assistant", data.assistantId)),
          getDoc(doc(db, "event", data.eventId)),
          data.phaseId ? getDoc(doc(db, "phase", data.phaseId)) : Promise.resolve(null),
          data.localityId ? getDoc(doc(db, "locality", data.localityId)) : Promise.resolve(null),
          data.promoterId
            ? getDoc(doc(db, "promoter", data.promoterId))
            : Promise.resolve(null),
          getDoc(doc(db, "ticketType", data.ticketTypeId)),
        ]);

        return {
          id: docSnap.id,
          ticketTypeId: data.ticketTypeId ?? "",
          status: data.status,
          price: data.price,
          qrCode: data.qrCode,
          createdAt: data.createdAt?.toDate?.() ?? null,
          updatedAt: data.updatedAt?.toDate?.() ?? null,
          checkedInAt: data.checkedInAt?.toDate?.() ?? null,

          // Asistente
          name: assistantSnap.exists() ? assistantSnap.data().name : "—",
          email: assistantSnap.exists() ? assistantSnap.data().email : "—",
          phoneNumber: assistantSnap.exists()
            ? (assistantSnap.data().phoneNumber ?? "—")
            : "—",
          identificationNumber: assistantSnap.exists()
            ? (assistantSnap.data().identificationNumber ?? "—")
            : "—",
          identificationType: assistantSnap.exists()
            ? (assistantSnap.data().identificationType ?? "—")
            : "—",

          // Evento
          eventName: eventSnap.exists() ? eventSnap.data().name : "—",

          // Fase
          phaseName: phaseSnap?.exists() ? phaseSnap.data().name : "—",

          // Localidad
          localityName: localitySnap?.exists() ? localitySnap.data().name : "—",

          // Promotor
          promoterName: promoterSnap?.exists() ? promoterSnap.data().name : "—",

          // ✅ Si necesitas el nombre del tipo de ticket
          ticketTypeName: ticketTypeSnap.exists()
            ? ticketTypeSnap.data().name
            : "—",
        };
      })
    );

    return NextResponse.json({ success: true, tickets });
  } catch (error) {
    const err = error instanceof Error ? error : new Error("Unknown error");
    console.error("Error al obtener tickets:", err);
    return NextResponse.json(
      { success: false, error: "Error al obtener tickets" },
      { status: 500 }
    );
  }
}
