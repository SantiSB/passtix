export interface EnrichedTicket {
  id: string;
  ticketType: string;
  price: number | null;
  status: string;
  qrCode: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  checkedInAt: Date | null;
  identificationNumber: string;

  assistantName: string;
  assistantEmail: string;
  phoneNumber: string;
  phaseName: string;
  localityName: string;
  promoterName?: string;
  discountAmount?: number;
  discountType?: string;
}
