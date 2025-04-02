import { IdentificationType } from "@/types/enums";

export interface Promoter {
  id: string;
  name: string;
  email: string;
  phone?: string;
  identificationNumber?: string;
  identificationType?: IdentificationType;
  active?: boolean;
  createdAt: Date;
  updatedAt: Date;
}
