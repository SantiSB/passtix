import { NextRequest, NextResponse } from "next/server";
import { updateTicket } from "@/lib/utils/ticket";

// Endpoint para actualizar un ticket
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      id,
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
    if (!id || !name || !email || !phoneNumber || !identificationNumber || !identificationType || !ticketType || !localityId || !phaseId || !promoterId || !price) {
      return NextResponse.json(
        { success: false, error: "Faltan campos obligatorios." },
        { status: 400 }
      );
    }

    // Actualizar el ticket en Firestore
    const updateResult = await updateTicket({
      id,
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
    });

    // Si no se pudo actualizar el ticket, devolver un error
    if (!updateResult.success) {
      return NextResponse.json(
        { success: false, error: "No se pudo actualizar el ticket." },
        { status: 500 }
      );
    }

    // Devolver el ticket actualizado
    return NextResponse.json({ success: true, ticket: updateResult.ticket });
  } catch (err: any) {
    console.error("Error en /update-ticket:", err);
    return NextResponse.json(
      { success: false, error: "Error interno al actualizar el ticket." },
      { status: 500 }
    );
  }
}
