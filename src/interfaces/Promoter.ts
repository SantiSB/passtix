import { IdentificationType } from "@/types/enums";
import { Timestamp } from "firebase/firestore";
export interface Promoter {
  id: string;
  name: string;
  email: string;
  phone?: string;
  identificationNumber?: string;
  identificationType?: IdentificationType;
  active?: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
