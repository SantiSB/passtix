import { db } from "@/lib/firebase/firebase";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { NextResponse } from "next/server";

// Endpoint para obtener todos los tickets
export async function GET() {
  try {
    // Obtener todos los tickets
    const snapshot = await getDocs(collection(db, "ticket"));

    // Mapear los tickets
    const tickets = await Promise.all(
      snapshot.docs.map(async (docSnap) => {
        // Obtener los datos del ticket
        const data = docSnap.data();

        // Obtener los datos de los asistentes, eventos, fases, localidades y promotores
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

        // Devolver los datos del ticket
        return {
          id: docSnap.id,
          ticketType: data.ticketType,
          status: data.status,
          price: data.price,
          qrCode: data.qrCode,
          createdAt: data.createdAt?.toDate?.() ?? null,
          updatedAt: data.updatedAt?.toDate?.() ?? null,
          checkedInAt: data.checkedInAt?.toDate?.() ?? null,

          // Datos del asistente
          name: assistantSnap.exists()
            ? assistantSnap.data().name
            : "—",
          email: assistantSnap.exists()
            ? assistantSnap.data().email
            : "—",
          phoneNumber: assistantSnap.exists()
            ? assistantSnap.data().phoneNumber ?? "—"
            : "—",
          identificationNumber: assistantSnap.exists()
            ? assistantSnap.data().identificationNumber ?? "—"
            : "—",

          // Datos del evento
          eventName: eventSnap.exists() ? eventSnap.data().name : "—",

          // Datos de la fase
          phaseName: phaseSnap.exists() ? phaseSnap.data().name : "—",

          // Datos de la localidad
          localityName: localitySnap.exists() ? localitySnap.data().name : "—",

          // Datos del promotor
          promoterName: promoterSnap?.exists()
            ? promoterSnap.data().name
            : null,
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
