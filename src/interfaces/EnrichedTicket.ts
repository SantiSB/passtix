export interface EnrichedTicket {
  // Datos del ticket
  id: string;
  ticketType: string;
  price: number | null;
  status: string;
  qrCode: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  checkedInAt: Date | null;
  
  // Datos del asistente
  identificationNumber: string;
  identificationType: string;
  assistantName: string;
  assistantEmail: string;
  phoneNumber: string;

  // Datos de la fase
  phaseName: string;

  // Datos de la localidad
  localityName: string;

  // Datos del promotor
  promoterName?: string;
}
