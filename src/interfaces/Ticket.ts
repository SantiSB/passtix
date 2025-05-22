import { TicketStatus } from "@/types/enums";

export interface Ticket {
  id: string;
  eventId: string;
  assistantId: string;
  promoterId?: string;
  ticketTypeId: string;
  localityId: string;
  phaseId: string;
  price: number | null;
  qrCode: string;
  status: TicketStatus;
  createdAt: Date;
  updatedAt: Date;
  checkedInAt: Date | null;
}
