import { NextRequest, NextResponse } from "next/server";
import { createTicket, saveTicket } from "@/lib/utils/ticket";
import { sendTicketEmail } from "@/lib/utils/email";
import { createAssistant, saveAssistant } from "@/lib/utils/assistant";

// Endpoint para registrar un ticket
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      phoneNumber,
      identificationNumber,
      identificationType,
      ticketType,
      localityId,
      phaseId,
      promoterId,
      price,
    } = body;

    // Validación básica
    if (!name || !email || !phoneNumber || !identificationNumber || !identificationType || !ticketType || !localityId || !phaseId || !promoterId || !price) {
      return NextResponse.json(
        { success: false, error: "Faltan campos obligatorios." },
        { status: 400 }
      );
    }

    // 1. Crear asistente
    const assistant = await createAssistant(
      name,
      email,
      phoneNumber,
      identificationNumber,
      identificationType
    );

    // 2. Crear ticket (con QR, sin guardar)
    const ticket = await createTicket({
      assistantId: assistant.id,
      phaseId,
      ticketType,
      localityId,
      price,
      promoterId,
      status: "enabled",
    });

    // 3. Enviar correo
    const emailResult = await sendTicketEmail({
      to: email,
      name,
      qrCodeUrl: ticket.qrCode,
      ticketId: ticket.id,      
    });

    // Si no se pudo enviar el correo, devolver un error
    if (!emailResult.success) {
      return NextResponse.json(
        { success: false, error: "No se pudo enviar el correo con el QR." },
        { status: 500 }
      );
    }

    // 4. Guardar el ticket en Firestore
    await saveTicket(ticket);

    // 5. Guardar el asistente en Firestore
    await saveAssistant(assistant);

    // Devolver el ticket creado
    return NextResponse.json({ success: true, ticket });
  } catch (err: unknown) {
    console.error("Error en /register-ticket:", err);
    return NextResponse.json(
      { success: false, error: "Error interno al registrar el ticket." },
      { status: 500 }
    );
  }
}
