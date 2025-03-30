import { IdentificationType } from "@/types/enums";

export interface Assistant {
  id: string;
  name: string;
  email: string;
  identificationNumber: string;
  identificationType: IdentificationType;
  phoneNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}
