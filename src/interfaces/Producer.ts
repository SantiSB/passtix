import { IdentificationType } from "@/types/enums";

export interface Producer {
  id: string;
  name: string;
  contactEmail: string;
  phoneNumber: string;
  identificationNumber: string;
  identificationType: IdentificationType;
  staffIds: string[];            
  createdAt: Date;
  updatedAt: Date;
}
