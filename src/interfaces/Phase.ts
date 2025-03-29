import { TicketType } from "@/types/enums";
export interface Phase {
  id: string;
  eventId: string;
  name: string;                  
  description?: string;
  price: number;
  ticketType: TicketType;
  order: number;                 
  startDate?: Date;
  endDate?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
