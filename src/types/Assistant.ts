export type AssistantStatus = 'Habilitado' | 'Ingresado';

export type Locality = 'General' | 'VIP' | 'Backstage' | 'Palco';

export type TicketType = 'Boleta' | 'Cortesia';

export interface Assistant {
  id: string;
  name: string;
  email: string;
  cellPhone: string;
  identificationCard: string;
  event: string;
  producer: string;
  promoter: string;
  locality: Locality;
  ticketType: TicketType;
  status: AssistantStatus;
  qrCode: string;
  phase: number;
  price: number;
  createdAt: Date;
  updatedAt: Date;
  checkedInAt: Date | null;
}