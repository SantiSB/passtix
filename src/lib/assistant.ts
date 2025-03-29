import { Assistant } from '@/interfaces/Assistant';
import { Ticket } from '@/interfaces/Ticket';
import { db, storage } from './firebase/firebase'; // Asegúrate de que "storage" también esté exportado
import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import QRCode from 'qrcode';
import { v4 as uuid } from 'uuid';
import { IdentificationType, TicketType, DeliveryMethod } from '@/types/enums';

/**
 * Crea un nuevo asistente y un ticket asociado
 */
export async function createAssistantWithTicket(
  name: string,
  email: string,
  phoneNumber: string,
  identificationNumber: string,
  identificationType: IdentificationType,
  ticketType: TicketType,
  eventId: string,
  phaseId: string,
  localityId: string,
  price: number,
  promoterId?: string,
  deliveryMethod?: DeliveryMethod,
  discountId?: string,
  discountAmount?: number
): Promise<{ assistant: Assistant; ticket: Ticket }> {
  const assistantId = uuid(); // ID único para el asistente

  // Crear asistente
  const assistant: Assistant = {
    id: assistantId,
    name,
    email,
    phoneNumber,
    identificationNumber,
    identificationType,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Guardar asistente en Firestore
  await setDoc(doc(db, 'assistants', assistantId), assistant);

  // Crear ticket asociado al asistente
  const ticketId = uuid(); // ID único para el ticket

  // Generar QR para el ticket
  const qrBuffer = await QRCode.toBuffer(ticketId, { type: 'png' });
  const qrRef = ref(storage, `qrcodes/${ticketId}.png`);
  await uploadBytes(qrRef, qrBuffer, { contentType: 'image/png' });
  const qrCodeUrl = await getDownloadURL(qrRef);

  // Crear ticket con los datos faltantes
  const ticket: Ticket = {
    id: ticketId,
    assistantId,
    eventId,
    phaseId,
    localityId,
    ticketType,
    price,
    promoterId,
    status: 'enabled',
    qrCode: qrCodeUrl,
    emailStatus: 'pending',
    deliveryMethod: deliveryMethod || 'manual',
    discountId,
    discountAmount,
    createdAt: new Date(),
    updatedAt: new Date(),
    checkedInAt: null,
  };

  // Guardar ticket en Firestore
  await setDoc(doc(db, 'tickets', ticketId), ticket);

  return { assistant, ticket };
}

export async function getAssistants(): Promise<Assistant[]> {
  const snapshot = await getDocs(collection(db, 'assistants'));
  return snapshot.docs.map((doc) => doc.data() as Assistant);
}