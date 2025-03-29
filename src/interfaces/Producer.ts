import { IdentificationType } from "@/types/enums";
import { Timestamp } from "firebase/firestore";
export interface Producer {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  identificationNumber: string;
  identificationType: IdentificationType;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
