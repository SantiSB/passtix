import { PaymentMethod, PaymentStatus } from "@/types/enums";

export interface Payment {
  id: string;
  ticketId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  createdAt: Date;
}
