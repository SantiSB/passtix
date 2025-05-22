import { NextRequest, NextResponse } from "next/server";
import { updateTicket } from "@/lib/utils/ticket";
import { updateAssistant } from "@/lib/utils/assistant";

// Endpoint para actualizar un ticket y su asistente
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      id,
      assistantId,
      name,
      email,
      phoneNumber,
      identificationNumber,
      identificationType,
      ticketTypeId, // ✅ corregido
      localityId,
      phaseId,
      promoterId,
      price,
    } = body;

    // Validación básica
    if (
      !id ||
      !assistantId ||
      !name ||
      !email ||
      !phoneNumber ||
      !identificationNumber ||
      !identificationType ||
      !ticketTypeId || // ✅ corregido
      !price
    ) {
      return NextResponse.json(
        { success: false, error: "Faltan campos obligatorios." },
        { status: 400 }
      );
    }

    // 1. Actualizar el asistente
    const assistantResult = await updateAssistant(assistantId, {
      name,
      email,
      phoneNumber,
      identificationNumber,
      identificationType,
    });

    if (!assistantResult.success) {
      return NextResponse.json(
        { success: false, error: "No se pudo actualizar el asistente." },
        { status: 500 }
      );
    }

    // 2. Actualizar el ticket
    const ticketResult = await updateTicket({
      id,
      assistantId,
      phoneNumber,
      identificationNumber,
      identificationType,
      ticketTypeId,
      localityId,
      phaseId,
      promoterId,
      price,
    });

    if (!ticketResult.success) {
      return NextResponse.json(
        { success: false, error: "No se pudo actualizar el ticket." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, ticket: ticketResult.ticket });
  } catch (err: unknown) {
    console.error("Error en /update-ticket:", err);
    return NextResponse.json(
      { success: false, error: "Error interno al actualizar el ticket." },
      { status: 500 }
    );
  }
}
