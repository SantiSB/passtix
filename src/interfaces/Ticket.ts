import {
  EmailStatus,
  TicketStatus,
  TicketType,
} from "@/types/enums";

export interface Ticket {
  id: string;
  eventId: string;
  assistantId: string;
  promoterId?: string;
  ticketType: TicketType;
  localityId: string;
  phaseId: string;
  price: number | null;
  qrCode: string;
  status: TicketStatus;
  emailStatus: EmailStatus;
  createdAt: Date;
  updatedAt: Date;
  checkedInAt: Date | null;
}
