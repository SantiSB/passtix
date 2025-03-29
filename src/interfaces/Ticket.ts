import {
  DeliveryMethod,
  EmailStatus,
  TicketStatus,
  TicketType,
} from "@/types/enums";

export interface Ticket {
  id: string;
  assistantId: string;
  eventId: string;
  promoterId?: string;
  ticketType: TicketType;
  localityId: string;
  phaseId: string;
  price: number | null;
  discountId?: string;
  discountAmount?: number;
  qrCode: string;
  status: TicketStatus;
  emailStatus: EmailStatus;
  deliveryMethod: DeliveryMethod;
  createdAt: Date;
  updatedAt: Date;
  checkedInAt: Date | null;
}
