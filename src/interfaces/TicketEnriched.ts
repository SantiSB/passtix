export interface TicketEnriched {
  id: string;
  ticketType: string;
  status: string;
  emailStatus: string;
  price: number | null;
  qrCode: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  checkedInAt: Date | null;

  assistantName: string;
  assistantEmail: string;
  phoneNumber: string;
  identificationNumber: string;
  eventName: string;
  phaseName: string;
  localityName: string;
  promoterName?: string | null;
}
