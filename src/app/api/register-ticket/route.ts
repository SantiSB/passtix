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

    // 🔐 Validación de campos obligatorios
    if (
      !name ||
      !email ||
      !identificationNumber ||
      !identificationType ||
      !ticketType ||
      !localityId ||
      !phaseId
    ) {
      return NextResponse.json(
        { success: false, error: "Faltan campos obligatorios." },
        { status: 400 }
      );
    }

    // 🧠 Campos opcionales con valores por defecto
    const optionalPhone = phoneNumber || null;
    const optionalPromoter = promoterId || null;
    const optionalPrice = price ?? null;

    // 1. Crear asistente
    const assistant = await createAssistant(
      name,
      email,
      optionalPhone,
      identificationNumber,
      identificationType
    );

    // 2. Crear ticket (con QR, sin guardar aún)
    const ticket = await createTicket({
      assistantId: assistant.id,
      phaseId,
      ticketType,
      localityId,
      price: optionalPrice,
      promoterId: optionalPromoter,
      status: "enabled",
    });

    // 3. Enviar correo con QR
    const emailResult = await sendTicketEmail({
      to: email,
      name,
      qrCodeUrl: ticket.qrCode,
      ticketId: ticket.id,
    });

    if (!emailResult.success) {
      return NextResponse.json(
        { success: false, error: "No se pudo enviar el correo con el QR." },
        { status: 500 }
      );
    }

    // 4. Guardar ticket y asistente en Firestore
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
