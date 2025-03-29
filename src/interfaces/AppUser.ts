import { UserRole } from "@/types/enums";

// Personal del sistema (administrador, editor, escáner, visualizador)
export interface AppUser {
  uid: string;                     
  name: string;
  email: string;
  role: UserRole;
  producerId: string;             
  createdAt: Date;
  updatedAt: Date;
}
