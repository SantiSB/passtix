"use client";

import { useEffect, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  getDoc,
  query,
  where,
  orderBy,
  DocumentReference,
} from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import { EnrichedTicket } from "@/interfaces/EnrichedTicket";
import { Ticket } from "@/interfaces/Ticket";

export default function useLiveTickets(eventId: string) {
  const [tickets, setTickets] = useState<EnrichedTicket[]>([]);
  const [loading, setLoading] = useState(true);

  const getSafeDoc = (collectionName: string, id?: string | null) => {
    return id && typeof id === "string" && !id.includes("/")
      ? doc(db, collectionName, id)
      : null;
  };

  useEffect(() => {
    if (!eventId) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "ticket"),
      where("eventId", "==", eventId),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const enriched: EnrichedTicket[] = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const ticket = docSnap.data() as Ticket;

          try {
            const assistantRef = getSafeDoc("assistant", ticket.assistantId);
            const phaseRef = getSafeDoc("phase", ticket.phaseId);
            const localityRef = getSafeDoc("locality", ticket.localityId);
            const promoterRef = getSafeDoc("promoter", ticket.promoterId ?? "");

            const [assistantSnap, phaseSnap, localitySnap, promoterSnap] =
              await Promise.all([
                assistantRef ? getDoc(assistantRef) : Promise.resolve(null),
                phaseRef ? getDoc(phaseRef) : Promise.resolve(null),
                localityRef ? getDoc(localityRef) : Promise.resolve(null),
                promoterRef ? getDoc(promoterRef) : Promise.resolve(null),
              ]);

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
            console.warn(`❌ Error enriqueciendo ticket ${docSnap.id}:`, error);
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

      setTickets(enriched);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [eventId]);

  return { tickets, loading };
}
