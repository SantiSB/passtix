import { Assistant } from "@/interfaces/Assistant";
import { Ticket } from "@/interfaces/Ticket";
import { createAssistantWithTicket } from "../assistant";
import { createTicketForAssistant } from "../ticket";
import { IdentificationType, TicketType, DeliveryMethod } from "@/types/enums";
/**
 * Flujo completo para registrar un asistente y su ticket
 */
export async function registerAssistantWithTicket(params: {
  name: string;
  email: string;
  cellPhone: string;
  identificationNumber: string;
  identificationType: IdentificationType;
  eventId: string;
  phaseId: string;
  ticketType: TicketType;
  localityId: string;
  price: number;
  promoterId?: string;
  deliveryMethod?: DeliveryMethod;
  discountId?: string;
  discountAmount?: number;
}): Promise<{ assistant: Assistant; ticket: Ticket }> {
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
  } = params;

  const assistant = await createAssistantWithTicket(
    name,
    email,
    cellPhone,
    identificationNumber,
    identificationType,
    ticketType,
    eventId,
    phaseId,
    localityId,
    price,
    promoterId,
    deliveryMethod,
    discountId,
    discountAmount
  );

  const ticket = await createTicketForAssistant({
    assistantId: assistant.assistant.id,
    eventId,
    phaseId,
    ticketType,
    localityId,
    price,
    promoterId,
    deliveryMethod,
    discountId,
    discountAmount
  });

  return { assistant: assistant.assistant, ticket };
}
