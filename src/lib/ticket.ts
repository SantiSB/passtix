import { db, storage } from "./firebase/firebase";
import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import QRCode from "qrcode";
import { v4 as uuid } from "uuid";
import { Ticket } from "@/interfaces/Ticket";

/**
 * Crea un ticket con QR vinculado a un asistente
 */
export async function createTicketForAssistant(params: {
  assistantId: string;
  eventId: string;
  phaseId: string;
  promoterId?: string;
  ticketType: "ticket" | "courtesy";
  localityId: string;
  price: number;
  deliveryMethod?: "email" | "manual" | "whatsapp";
  discountId?: string;
  discountAmount?: number;
}): Promise<Ticket> {
  const {
    assistantId,
    eventId,
    phaseId,
    promoterId,
    ticketType,
    localityId,
    price,
    deliveryMethod = "manual",
    discountId,
    discountAmount,
  } = params;

  const ticketId = uuid();

  // Generar QR con el ID del ticket
  const qrBuffer = await QRCode.toBuffer(ticketId, { type: "png" });
  const qrRef = ref(storage, `qrcodes/${ticketId}.png`);
  await uploadBytes(qrRef, qrBuffer, { contentType: "image/png" });
  const qrCodeUrl = await getDownloadURL(qrRef);

  const ticket: Ticket = {
    id: ticketId,
    assistantId,
    eventId,
    phaseId,
    promoterId,
    ticketType,
    localityId,
    price,
    qrCode: qrCodeUrl,
    status: "enabled",
    emailStatus: "pending",
    deliveryMethod,
    discountId,
    discountAmount,
    createdAt: new Date(),
    updatedAt: new Date(),
    checkedInAt: null,
  };

  await setDoc(doc(collection(db, "tickets"), ticketId), ticket);

  return ticket;
}

export async function getTicketsByAssistantId(
  assistantId: string
): Promise<Ticket[]> {
  const ticketsRef = collection(db, 'tickets');
  const q = query(ticketsRef, where('assistantId', '==', assistantId));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => doc.data() as Ticket);
}