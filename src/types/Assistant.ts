export type AssistantStatus = 'enabled' | 'joined';

export interface Assistant {
  id: string;
  identificationCard: string;
  name: string;
  email: string;
  cellPhone: string;
  ticketType: 'General' | 'VIP' | 'Backstage';
  status: AssistantStatus;
  qrCode: string;
  createdAt: Date;
  updatedAt: Date;
  checkedInAt: Date | null;
  cedula: string;
}