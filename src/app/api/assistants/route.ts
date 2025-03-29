// app/api/assistants/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { registerAssistantWithTicket } from '@/lib/actions/registerAssistantWithTicket';
import {
  IdentificationType,
  TicketType,
  DeliveryMethod
} from '@/types/enums';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      name,
      email,
      cellPhone,
      identificationNumber,
      identificationType,
      eventId,
      phaseId,
      ticketType,
      localityId,
      price,
      promoterId,
      deliveryMethod,
      discountId,
      discountAmount
    } = body;

    // Validación básica
    if (
      !name || !email || !identificationNumber ||
      !identificationType || !eventId || !phaseId ||
      !ticketType || !localityId
    ) {
      return NextResponse.json(
        { success: false, error: 'Faltan campos obligatorios.' },
        { status: 400 }
      );
    }

    const { assistant, ticket } = await registerAssistantWithTicket({
      name,
      email,
      cellPhone,
      identificationNumber,
      identificationType: identificationType as IdentificationType,
      ticketType: ticketType as TicketType,
      localityId,
      eventId,
      phaseId,
      price,
      promoterId,
      deliveryMethod: deliveryMethod as DeliveryMethod,
      discountId,
      discountAmount
    });

    return NextResponse.json({ success: true, assistant, ticket });
  } catch (error: unknown) {
    console.error('Error al registrar asistente:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}
