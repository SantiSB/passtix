import { Assistant } from "@/interfaces/Assistant";
import { Ticket } from "@/interfaces/Ticket";
import { createAssistant } from "../assistant";
import { createTicket } from "../ticket";
import { IdentificationType, TicketType } from "@/types/enums";

/**
 * Flujo completo para registrar un asistente y su ticket
 */
export async function registerAssistantWithTicket(params: {
  name: string;
  email: string;
  phoneNumber: string;
  identificationNumber: string;
  identificationType: IdentificationType;
  eventId: string;
  phaseId: string;
  ticketType: TicketType;
  localityId: string;
  price: number | null;
  promoterId?: string;
}): Promise<{ assistant: Assistant; ticket: Ticket }> {
  const {
    name,
    email,
    phoneNumber,
    identificationNumber,
    identificationType,
    eventId,
    phaseId,
    ticketType,
    localityId,
    price,
    promoterId,
  } = params;

  // ✅ Crear asistente
  const assistant = await createAssistant(
    name,
    email,
    phoneNumber,
    identificationNumber,
    identificationType
  );

  // ✅ Crear ticket vinculado al asistente
  const ticket = await createTicket({
    assistantId: assistant.id,
    eventId,
    phaseId,
    ticketType,
    localityId,
    price,
    promoterId,
    emailStatus: "pending",
    status: "enabled",
  });

  return { assistant, ticket };
}
