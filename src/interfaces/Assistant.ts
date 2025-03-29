import { IdentificationType } from "@/types/enums";
import { Timestamp } from "firebase/firestore";
export interface Assistant {
  id: string;
  name: string;
  email: string;
  identificationNumber: string;
  identificationType: IdentificationType;
  phoneNumber?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
