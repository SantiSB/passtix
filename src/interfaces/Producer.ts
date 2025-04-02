import { IdentificationType } from "@/types/enums";

export interface Producer {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  identificationNumber: string;
  identificationType: IdentificationType;
  createdAt: Date;
  updatedAt: Date;
}
