import { db, storage } from "../firebase/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  query,
  orderBy,
  limit,
  startAfter,
  DocumentSnapshot,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import QRCode from "qrcode";
import { v4 as uuid } from "uuid";
import { Ticket } from "@/interfaces/Ticket";
import { TicketType, EmailStatus, TicketStatus } from "@/types/enums";
import { EnrichedTicket } from "@/interfaces/EnrichedTicket";

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

/**
 * Obtiene un ticket por su ID
 */
export async function getTicket(id: string): Promise<Ticket> {
  const ticketRef = doc(db, "ticket", id);
  const ticketSnap = await getDoc(ticketRef);
  return ticketSnap.data() as Ticket;
}

/**
 * Consulta tickets paginados para React Query
 */
export async function fetchPaginatedTickets(
  pageSize = 10,
  lastDoc: DocumentSnapshot | null = null
): Promise<{
  tickets: EnrichedTicket[];
  lastDoc: DocumentSnapshot | null;
  hasMore: boolean;
}> {
  let q = query(
    collection(db, "ticket"),
    orderBy("createdAt", "desc"),
    limit(pageSize)
  );

  if (lastDoc) {
    q = query(
      collection(db, "ticket"),
      orderBy("createdAt", "desc"),
      startAfter(lastDoc),
      limit(pageSize)
    );
  }

  const snapshot = await getDocs(q);

  const enrichedTickets: EnrichedTicket[] = await Promise.all(
    snapshot.docs.map(async (docSnap) => {
      const ticket = docSnap.data() as Ticket;

      // Obtener datos relacionados
      const assistantSnap = await getDoc(
        doc(db, "assistant", ticket.assistantId)
      );
      const assistant = assistantSnap.data();

      const phaseSnap = await getDoc(doc(db, "phase", ticket.phaseId));
      const phase = phaseSnap.data();

      const localitySnap = await getDoc(doc(db, "locality", ticket.localityId));
      const locality = localitySnap.data();

      const promoterSnap = ticket.promoterId
        ? await getDoc(doc(db, "promoter", ticket.promoterId))
        : null;
      const promoter = promoterSnap?.data();

      return {
        ...ticket,
        id: docSnap.id,
        assistantName: assistant?.name ?? "—",
        assistantEmail: assistant?.email ?? "—",
        phoneNumber: assistant?.phoneNumber ?? "—",
        identificationNumber: assistant?.identificationNumber ?? "—",
        phaseName: phase?.name ?? "—",
        localityName: locality?.name ?? "—",
        promoterName: promoter?.name ?? "—",
      };
    })
  );

  return {
    tickets: enrichedTickets,
    lastDoc: snapshot.docs[snapshot.docs.length - 1] ?? null,
    hasMore: snapshot.docs.length === pageSize,
  };
}
