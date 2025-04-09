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
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import QRCode from "qrcode";
import { v4 as uuid } from "uuid";
import { Ticket } from "@/interfaces/Ticket";
import { TicketType, TicketStatus } from "@/types/enums";
import { EnrichedTicket } from "@/interfaces/EnrichedTicket";

// ID del evento BICHIYAL
const BICHIYAL_EVENT_ID = "kZEZ4x42RtwELpkO3dEf";

// Crea un ticket con QR
export async function createTicket(params: {
  assistantId: string;
  phaseId: string;
  ticketType: TicketType;
  localityId: string;
  price: number | null;
  promoterId?: string;
  status: TicketStatus;
}): Promise<Ticket> {
  const {
    assistantId,
    phaseId,
    ticketType,
    localityId,
    price,
    promoterId,
    status,
  } = params;

  // Generar ID del ticket
  const ticketId = uuid();

  // Generar QR con el ID del ticket
  const qrBuffer = await QRCode.toBuffer(ticketId, { type: "png" });

  // Guardar QR en Firebase Storage
  const qrRef = ref(storage, `qrcodes/${ticketId}.png`);

  // Subir QR a Firebase Storage
  await uploadBytes(qrRef, qrBuffer, { contentType: "image/png" });

  // Obtener URL del QR
  const qrCodeUrl = await getDownloadURL(qrRef);

  // Generar fecha y hora actual
  const now = new Date();

  // Crear ticket
  const ticket: Ticket = {
    id: ticketId,
    eventId: BICHIYAL_EVENT_ID,
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

  // Devolver ticket creado
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
  searchName: string = ""
): Promise<{
  tickets: EnrichedTicket[];
  lastDoc: DocumentSnapshot | null;
  hasMore: boolean;
}> {
  const ticketCollection = collection(db, "ticket");

  let q;
  let isFilteredSearch = Boolean(searchName?.trim());

  if (isFilteredSearch) {
    // 🔍 No usamos paginación si hay filtro
    q = query(ticketCollection, orderBy("createdAt", "asc"));
  } else {
    // 🔄 Usamos paginación normal
    const queryConstraints = [
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
        name: assistant?.name ?? "—",
        email: assistant?.email ?? "—",
        phoneNumber: assistant?.phoneNumber ?? "—",
        identificationNumber: assistant?.identificationNumber ?? "—",
        identificationType: assistant?.identificationType ?? "—",
        phaseName: phase?.name ?? "—",
        localityName: locality?.name ?? "—",
        promoterName: promoter?.name ?? "—",
      };
    })
  );

  // 🔍 Aplicar filtro si hay searchTerm
  const filteredTickets = isFilteredSearch
    ? enrichedTickets.filter((ticket) =>
        ticket.name.toLowerCase().includes(searchName.toLowerCase())
      )
    : enrichedTickets;

  return {
    tickets: filteredTickets,
    lastDoc: isFilteredSearch
      ? null // No hay paginación cuando se filtra
      : snapshot.docs[snapshot.docs.length - 1] ?? null,
    hasMore: !isFilteredSearch && snapshot.docs.length === pageSize,
  };
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
