import { NextRequest, NextResponse } from "next/server";
import { createTicket, saveTicket } from "@/lib/utils/ticket";
import { sendTicketEmail } from "@/lib/utils/email";
import { createAssistant, saveAssistant } from "@/lib/utils/assistant";
import { db } from "@/lib/firebase/firebase";
import { doc, getDoc, Timestamp } from "firebase/firestore";

interface EventData {
  name?: string;
  location?: string;
  date?: Timestamp | Date;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      eventId,
      name,
      email,
      phoneNumber,
      identificationNumber,
      identificationType,
      ticketTypeId,
      localityId,
      phaseId,
      promoterId,
      price,
    } = body;

    if (
      !eventId ||
      !name ||
      !email ||
      !identificationNumber ||
      !identificationType ||
      !ticketTypeId
    ) {
      return NextResponse.json(
        { success: false, error: "Faltan campos obligatorios." },
        { status: 400 }
      );
    }

    // 1. Obtener datos del evento
    const eventSnap = await getDoc(doc(db, "event", eventId));
    if (!eventSnap.exists()) {
      return NextResponse.json(
        { success: false, error: "Evento no encontrado." },
        { status: 404 }
      );
    }

    const eventData = eventSnap.data() as EventData;
    const eventName = eventData.name ?? "Evento";
    const eventLocation = eventData.location ?? "";

    let eventDate = "";
    if (eventData.date) {
      const dateObj =
        eventData.date instanceof Timestamp
          ? eventData.date.toDate()
          : new Date(eventData.date);
      eventDate = dateObj.toLocaleDateString("es-CO", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    }

    // 2. Obtener nombre del tipo de ticket
    const ticketTypeSnap = await getDoc(doc(db, "ticketTypes", ticketTypeId));
    const ticketTypeName = ticketTypeSnap.exists()
      ? ticketTypeSnap.data().name
      : ticketTypeId;


    // 3. Crear asistente y ticket
    const assistant = await createAssistant(
      name,
      email,
      phoneNumber || null,
      identificationNumber,
      identificationType
    );

    const ticket = await createTicket({
      eventId,
      assistantId: assistant.id,
      phaseId,
      ticketTypeId,
      localityId,
      price: price ?? null,
      promoterId: promoterId || null,
      status: "enabled",
    });

    // 4. Enviar correo
    const emailResult = await sendTicketEmail({
      to: email,
      name,
      qrCodeUrl: ticket.qrCode,
      ticketId: ticket.id,
      eventName,
      eventDate,
      eventLocation,
      ticketTypeName, // ✅ nombre real aquí
    });

    if (!emailResult.success) {
      console.error("Error al enviar el correo:", emailResult.error);
      return NextResponse.json(
        { success: false, error: "No se pudo enviar el correo con el QR." },
        { status: 500 }
      );
    }

    // 5. Guardar en Firestore
    await saveTicket(ticket);
    await saveAssistant(assistant);

    return NextResponse.json({ success: true, ticket });
  } catch (err: unknown) {
    console.error("Error en /register-ticket:", err);
    return NextResponse.json(
      { success: false, error: "Error interno al registrar el ticket." },
      { status: 500 }
    );
  }
}
