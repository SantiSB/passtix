import { db, storage } from "./firebase/firebase";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import QRCode from "qrcode";
import { v4 as uuid } from "uuid";
import { Ticket } from "@/interfaces/Ticket";
import { TicketType, EmailStatus, TicketStatus } from "@/types/enums";

/**
 * Crea un ticket con QR
 */
export async function createTicket(params: {
  eventId: string;
  assistantId: string;
  phaseId: string;
  ticketType: TicketType;
  localityId: string;
  price: number | null;
  promoterId?: string;
  emailStatus: EmailStatus;
  status: TicketStatus;
}): Promise<Ticket> {
  const {
    eventId,
    assistantId,
    phaseId,
    ticketType,
    localityId,
    price,
    promoterId,
    emailStatus,
    status,
  } = params;

  const ticketId = uuid();

  // Generar QR con el ID del ticket
  const qrBuffer = await QRCode.toBuffer(ticketId, { type: "png" });
  const qrRef = ref(storage, `qrcodes/${ticketId}.png`);
  await uploadBytes(qrRef, qrBuffer, { contentType: "image/png" });
  const qrCodeUrl = await getDownloadURL(qrRef);

  const now = new Date();

  const ticket: Ticket = {
    id: ticketId,
    eventId,
    assistantId,
    phaseId,
    promoterId,
    ticketType,
    localityId,
    price,
    qrCode: qrCodeUrl,
    status,
    emailStatus,
    createdAt: now,
    updatedAt: now,
    checkedInAt: null,
  };

  await setDoc(doc(db, "ticket", ticketId), ticket);
  return ticket;
}
