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
  deleteDoc,
  where,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import QRCode from "qrcode";
import { v4 as uuid } from "uuid";
import { Ticket } from "@/interfaces/Ticket";
import { TicketType, TicketStatus } from "@/types/enums";
import { EnrichedTicket } from "@/interfaces/EnrichedTicket";

// ID del evento BICHIYAL
// const BICHIYAL_EVENT_ID = "kZEZ4x42RtwELpkO3dEf";

// Crea un ticket con QR
export async function createTicket(params: {
  eventId: string; // 👈 Nuevo parámetro dinámico
  assistantId: string;
  phaseId: string;
  ticketType: TicketType;
  localityId: string;
  price: number | null;
  promoterId?: string;
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
    status,
  } = params;

  const ticketId = uuid();
  const qrBuffer = await QRCode.toBuffer(ticketId, { type: "png" });

  const qrRef = ref(storage, `qrcodes/${ticketId}.png`);
  await uploadBytes(qrRef, qrBuffer, { contentType: "image/png" });
  const qrCodeUrl = await getDownloadURL(qrRef);

  const now = new Date();

  const ticket: Ticket = {
    id: ticketId,
    eventId, // 👈 Usamos el que se pasó como parámetro
    assistantId,
    phaseId,
    promoterId,
    ticketType,
    localityId,
    price,
    qrCode: qrCodeUrl,
    status,
    createdAt: now,
    updatedAt: now,
    checkedInAt: null,
  };

  return ticket;
}

// Guarda un ticket en la base de datos
export async function saveTicket(ticket: Ticket): Promise<void> {
  // Obtener referencia del ticket
  const ticketRef = doc(db, "ticket", ticket.id);

  // Guardar ticket en Firestore
  await setDoc(ticketRef, ticket);
}

// Obtiene un ticket por su ID
export async function getTicket(id: string): Promise<Ticket> {
  // Obtener referencia del ticket
  const ticketRef = doc(db, "ticket", id);

  // Obtener ticket
  const ticketSnap = await getDoc(ticketRef);

  // Devolver ticket
  return ticketSnap.data() as Ticket;
}

// Consulta tickets paginados para React Query
export async function fetchPaginatedTickets(
  pageSize = 10,
  lastDoc: DocumentSnapshot | null = null,
  searchName: string = "",
  searchIdNumber: string = "",
  eventId: string
): Promise<{
  tickets: EnrichedTicket[];
  lastDoc: DocumentSnapshot | null;
  hasMore: boolean;
}> {
  try {
    const ticketCollection = collection(db, "ticket");
    const isFilteredSearch = Boolean(
      searchName?.trim() || searchIdNumber?.trim()
    );

    let q;

    if (isFilteredSearch) {
      q = query(
        ticketCollection,
        orderBy("createdAt", "asc"),
        where("eventId", "==", eventId)
      );
    } else {
      const queryConstraints = [
        where("eventId", "==", eventId),
        orderBy("createdAt", "asc"),
        ...(lastDoc ? [startAfter(lastDoc)] : []),
        limit(pageSize),
      ];
      q = query(ticketCollection, ...queryConstraints);
    }

    const snapshot = await getDocs(q);

    const enrichedTickets: EnrichedTicket[] = await Promise.all(
      snapshot.docs.map(async (docSnap) => {
        const ticket = docSnap.data() as Ticket;

        try {
          const assistantSnap = ticket.assistantId
            ? await getDoc(doc(db, "assistant", ticket.assistantId))
            : null;
          const phaseSnap = ticket.phaseId
            ? await getDoc(doc(db, "phase", ticket.phaseId))
            : null;
          const localitySnap = ticket.localityId
            ? await getDoc(doc(db, "locality", ticket.localityId))
            : null;
          const promoterSnap = ticket.promoterId
            ? await getDoc(doc(db, "promoter", ticket.promoterId))
            : null;

          const assistant = assistantSnap?.data();
          const phase = phaseSnap?.data();
          const locality = localitySnap?.data();
          const promoter = promoterSnap?.data();

          return {
            ...ticket,
            id: docSnap.id,
            name: assistant?.name ?? "—",
            email: assistant?.email ?? "—",
            phoneNumber: assistant?.phoneNumber ?? "—",
            identificationNumber: assistant?.identificationNumber ?? "—",
            identificationType: assistant?.identificationType ?? "—",
            phaseName: phase?.name ?? "—",
            localityName: locality?.name ?? "—",
            promoterName: promoter?.name ?? "—",
          };
        } catch (error) {
          console.warn(`⚠️ Error enriqueciendo ticket ${docSnap.id}:`, error);
          return {
            ...ticket,
            id: docSnap.id,
            name: "—",
            email: "—",
            phoneNumber: "—",
            identificationNumber: "—",
            identificationType: "—",
            phaseName: "—",
            localityName: "—",
            promoterName: "—",
          };
        }
      })
    );

    const filteredTickets = enrichedTickets.filter((ticket) => {
      const matchesName = ticket.name
        .toLowerCase()
        .includes(searchName.toLowerCase());
      const matchesIdNumber =
        ticket.identificationNumber.includes(searchIdNumber);
      return matchesName && matchesIdNumber;
    });

    return {
      tickets: filteredTickets,
      lastDoc: isFilteredSearch
        ? null
        : (snapshot.docs[snapshot.docs.length - 1] ?? null),
      hasMore: !isFilteredSearch && snapshot.docs.length === pageSize,
    };
  } catch (err) {
    console.error("🔥 Error en fetchPaginatedTickets:", err);
    throw err; // 🔁 para que React Query sepa que falló
  }
}

// Actualiza un ticket en la base de datos
export async function updateTicket(params: {
  id: string;
  assistantId: string;
  phoneNumber: string;
  identificationNumber: string;
  identificationType: string;
  ticketType: TicketType;
  localityId: string;
  phaseId: string;
  promoterId: string;
  price: number;
}): Promise<{ success: boolean; ticket?: Ticket }> {
  try {
    const {
      id,
      assistantId,
      phoneNumber,
      identificationNumber,
      identificationType,
      ticketType,
      localityId,
      phaseId,
      promoterId,
      price,
    } = params;

    const ticketRef = doc(db, "ticket", id);
    const ticketSnap = await getDoc(ticketRef);

    if (!ticketSnap.exists()) {
      return { success: false };
    }

    const existingTicket = ticketSnap.data() as Ticket;
    const updatedTicket = {
      ...existingTicket,
      assistantId,
      phoneNumber,
      identificationNumber,
      identificationType,
      ticketType,
      localityId,
      phaseId,
      promoterId,
      price,
      updatedAt: new Date(),
    };

    await setDoc(ticketRef, updatedTicket);

    return { success: true, ticket: updatedTicket };
  } catch (error) {
    console.error("Error updating ticket:", error);
    return { success: false };
  }
}

// Elimina un ticket de la base de datos
export async function deleteTicket(id: string): Promise<{ success: boolean }> {
  try {
    const ticketRef = doc(db, "ticket", id);
    await deleteDoc(ticketRef);
    return { success: true };
  } catch (error) {
    console.error("Error deleting ticket:", error);
    return { success: false };
  }
}
