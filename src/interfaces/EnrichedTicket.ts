export interface EnrichedTicket {
  // Datos del ticket
  id: string;
  ticketTypeId: string;
  ticketTypeName?: string; // 👈 NUEVO
  price: number | null;
  status: string;
  qrCode: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  checkedInAt: Date | null;

  // Datos del asistente
  identificationNumber: string;
  identificationType: string;
  name: string;
  email: string;
  phoneNumber: string;

  // Datos de la fase
  phaseName: string;
  phaseId: string;

  // Datos de la localidad
  localityName: string;
  localityId: string;

  // Datos del promotor
  promoterName?: string;
  promoterId?: string;
}
