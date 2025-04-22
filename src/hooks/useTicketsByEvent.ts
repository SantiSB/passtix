"use client";

import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import { Ticket } from "@/interfaces/Ticket";

export default function useTicketsByEvent(eventId: string | null) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      if (!eventId) return;

      const q = query(
        collection(db, "ticket"),
        where("eventId", "==", eventId)
      );

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        ...(doc.data() as Ticket),
        id: doc.id,
      }));

      setTickets(data);
      setLoading(false);
    };

    setTickets([]);
    setLoading(true);
    fetchTickets();
  }, [eventId]);

  return { tickets, loading };
}
