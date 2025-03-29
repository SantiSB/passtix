import { Timestamp } from "firebase/firestore";

export interface Event {
  id: string;
  name: string;
  date: Timestamp;                  
  location: string;
  producerId: string;
  promoters: string[];           
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
