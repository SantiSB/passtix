import { Timestamp } from "firebase/firestore";

export interface Phase {
  id: string;
  eventId: string;
  name: string;                  
  description?: string;
  price: number;
  order: number;                 
  startDate?: Timestamp;
  endDate?: Timestamp;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
