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
import { TicketStatus } from "@/types/enums";
import { EnrichedTicket } from "@/interfaces/EnrichedTicket";

/* -------------------------------------------------------------------------- */
/*                               Crear Ticket                                 */
/* -------------------------------------------------------------------------- */
export async function createTicket(params: {
  eventId: string;
  assistantId: string;
  phaseId: string;
  ticketTypeId: string;
  localityId: string;
  price: number | null;
  promoterId?: string;
  status: TicketStatus;
  ticketTypeName?: string;
}): Promise<Ticket> {
  const {
    eventId,
    assistantId,
    phaseId,
    ticketTypeId,
    localityId,
    price,
    promoterId,
    status,
    ticketTypeName,
  } = params;

  const ticketId = uuid();
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
    ticketTypeId,
    localityId,
    price,
    promoterId,
    qrCode: qrCodeUrl,
    status,
    createdAt: now,
    updatedAt: now,
    checkedInAt: null,
    ticketTypeName: ticketTypeName || undefined,
  };

  return ticket;
}

/* -------------------------------------------------------------------------- */
/*                             Guardar Ticket                                 */
/* -------------------------------------------------------------------------- */
export async function saveTicket(ticket: Ticket): Promise<void> {
  await setDoc(doc(db, "ticket", ticket.id), ticket);
}

/* -------------------------------------------------------------------------- */
/*                            Obtener Ticket por ID                           */
/* -------------------------------------------------------------------------- */
export async function getTicket(id: string): Promise<Ticket> {
  const ticketSnap = await getDoc(doc(db, "ticket", id));
  return ticketSnap.data() as Ticket;
}

/* -------------------------------------------------------------------------- */
/*                       Obtener Tickets paginados                            */
/* -------------------------------------------------------------------------- */
export async function fetchPaginatedTickets(
  pageSize = 10,
  lastDoc: DocumentSnapshot | null = null,
  searchName = "",
  searchIdNumber = "",
  searchTicketId = "",
  eventId: string
): Promise<{
  tickets: EnrichedTicket[];
  lastDoc: DocumentSnapshot | null;
  hasMore: boolean;
}> {
  try {
    const ticketCollection = collection(db, "ticket");
    const isFilteredSearch = Boolean(
      searchName.trim() || searchIdNumber.trim() || searchTicketId.trim()
    );

    const baseQuery = isFilteredSearch
      ? query(
          ticketCollection,
          where("eventId", "==", eventId),
          orderBy("createdAt", "asc")
        )
      : query(
          ticketCollection,
          where("eventId", "==", eventId),
          orderBy("createdAt", "asc"),
          ...(lastDoc ? [startAfter(lastDoc)] : []),
          limit(pageSize)
        );

    const snapshot = await getDocs(baseQuery);

    const enrichedTickets: EnrichedTicket[] = await Promise.all(
      snapshot.docs.map(async (docSnap) => {
        const ticket = docSnap.data() as Ticket;

        try {
          const [assistantSnap, phaseSnap, localitySnap, promoterSnap, ticketTypeSnap] =
            await Promise.all([
              ticket.assistantId
                ? getDoc(doc(db, "assistant", ticket.assistantId))
                : null,
              ticket.phaseId ? getDoc(doc(db, "phase", ticket.phaseId)) : null,
              ticket.localityId
                ? getDoc(doc(db, "locality", ticket.localityId))
                : null,
              ticket.promoterId
                ? getDoc(doc(db, "promoter", ticket.promoterId))
                : null,
              ticket.ticketTypeId
                ? getDoc(doc(db, "ticketTypes", ticket.ticketTypeId))
                : null,
            ]);

          const assistant = assistantSnap?.data();
          const phase = phaseSnap?.data();
          const locality = localitySnap?.data();
          const promoter = promoterSnap?.data();
          const ticketType = ticketTypeSnap?.data();

          return {
            ...ticket,
            id: docSnap.id,
            ticketTypeId: ticket.ticketTypeId ?? "",
            name: assistant?.name ?? "—",
            email: assistant?.email ?? "—",
            phoneNumber: assistant?.phoneNumber ?? "—",
            identificationNumber: assistant?.identificationNumber ?? "—",
            identificationType: assistant?.identificationType ?? "—",
            phaseName: phase?.name ?? "—",
            localityName: locality?.name ?? "—",
            promoterName: promoter?.name ?? "—",
            ticketTypeName: ticketType?.name ?? "—",
          };
        } catch (error) {
          console.warn(`⚠️ Error enriqueciendo ticket ${docSnap.id}:`, error);
          return {
            ...ticket,
            id: docSnap.id,
            ticketTypeId: ticket.ticketTypeId ?? "",
            name: "—",
            email: "—",
            phoneNumber: "—",
            identificationNumber: "—",
            identificationType: "—",
            phaseName: "—",
            localityName: "—",
            promoterName: "—",
            ticketTypeName: "—",
          };
        }
      })
    );

    const filteredTickets = isFilteredSearch
      ? enrichedTickets.filter((ticket) => {
          const matchName = ticket.name
            .toLowerCase()
            .includes(searchName.toLowerCase());
          const matchIdNumber =
            ticket.identificationNumber.includes(searchIdNumber);
          const matchTicketId = ticket.id
            .toLowerCase()
            .includes(searchTicketId.toLowerCase());
          return matchName && matchIdNumber && matchTicketId;
        })
      : enrichedTickets;

    return {
      tickets: filteredTickets,
      lastDoc:
        !isFilteredSearch && snapshot.docs.length > 0
          ? snapshot.docs[snapshot.docs.length - 1]
          : null,
      hasMore: !isFilteredSearch && snapshot.docs.length === pageSize,
    };
  } catch (err) {
    console.error("🔥 Error en fetchPaginatedTickets:", err);
    throw err;
  }
}

/* -------------------------------------------------------------------------- */
/*                             Actualizar Ticket                              */
/* -------------------------------------------------------------------------- */
export async function updateTicket(params: {
  id: string;
  assistantId: string;
  phoneNumber: string;
  identificationNumber: string;
  identificationType: string;
  ticketTypeId: string;
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
      ticketTypeId,
      localityId,
      phaseId,
      promoterId,
      price,
    } = params;

    const ticketRef = doc(db, "ticket", id);
    const ticketSnap = await getDoc(ticketRef);
    if (!ticketSnap.exists()) return { success: false };

    const existingTicket = ticketSnap.data() as Ticket;

    const updatedTicket = {
      ...existingTicket,
      assistantId,
      phoneNumber,
      identificationNumber,
      identificationType,
      ticketTypeId,
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

/* -------------------------------------------------------------------------- */
/*                            Eliminar Ticket                                 */
/* -------------------------------------------------------------------------- */
export async function deleteTicket(id: string): Promise<{ success: boolean }> {
  try {
    await deleteDoc(doc(db, "ticket", id));
    return { success: true };
  } catch (error) {
    console.error("Error deleting ticket:", error);
    return { success: false };
  }
}

/* -------------------------------------------------------------------------- */
/*                          Estilos de badges                                 */
/* -------------------------------------------------------------------------- */
export const getStatusBadgeClass = (status: string) => {
  switch (status.toLowerCase()) {
    case "enabled":
      return "bg-blue-800 text-white";
    case "joined":
      return "bg-green-800 text-white";
    default:
      return "bg-gray-300 text-gray-700";
  }
};

export const getPhaseBadgeClass = (phaseName: string | undefined) => {
  const name = phaseName?.toLowerCase() ?? "";
  if (name.includes("lanzamiento")) return "bg-green-900 text-green-300";
  if (name.includes("preventa")) return "bg-yellow-900 text-yellow-300";
  return "bg-gray-600 text-gray-300";
};
