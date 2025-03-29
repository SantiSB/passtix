import { IdentificationType } from "@/types/enums";

export interface Assistant {
  id: string;
  userId?: string;               
  name: string;
  email: string;
  identificationNumber: string;
  identificationType: IdentificationType;
  cellPhone?: string;
  createdAt: Date;
  updatedAt: Date;
}
