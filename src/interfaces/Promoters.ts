import { IdentificationType } from "@/types/enums";

export interface Promoter {
  id: string;
  name: string;
  contactEmail: string;
  phone?: string;
  identificationNumber?: string;
  identificationType?: IdentificationType;
  code?: string;                
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
  };
  active?: boolean;
  createdAt: Date;
  updatedAt: Date;
}
