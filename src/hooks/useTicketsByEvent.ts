"use client";

import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";

export default function useTicketsByEvent(eventId: string | null) {
  const [tickets, setTickets] = useState<any[]>([]);
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
        id: doc.id,
        ...doc.data(),
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
