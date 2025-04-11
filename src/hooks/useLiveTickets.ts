import { useEffect, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  getDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import { EnrichedTicket } from "@/interfaces/EnrichedTicket";
import { Ticket } from "@/interfaces/Ticket";

export default function useLiveTickets() {
  const [tickets, setTickets] = useState<EnrichedTicket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "ticket"), orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const enriched: EnrichedTicket[] = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const ticket = docSnap.data() as Ticket;

          const assistantSnap = await getDoc(
            doc(db, "assistant", ticket.assistantId)
          );
          const assistant = assistantSnap.data();

          const phaseSnap = await getDoc(doc(db, "phase", ticket.phaseId));
          const phase = phaseSnap.data();

          const localitySnap = await getDoc(
            doc(db, "locality", ticket.localityId)
          );
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

      setTickets(enriched);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { tickets, loading };
}
