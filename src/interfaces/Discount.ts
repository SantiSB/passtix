import { DiscountType, TicketType } from "@/types/enums";

export interface Discount {
  id: string;                  
  description?: string;
  type: DiscountType;          
  value: number;              
  maxUses?: number;           
  usedCount?: number;         
  validFrom?: Date;
  validUntil?: Date;
  applicableEventIds?: string[];
  applicablePhaseIds?: string[];
  applicableTicketTypes?: TicketType[];
  createdAt: Date;
  updatedAt: Date;
}
