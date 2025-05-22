"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export type TicketTypeOption = {
  id: string;
  name: string;
  description?: string;
  price?: number;
  maxEntryTime?: Date | null;
};

const useTicketTypeOptions = (eventId: string) => {
  const [ticketTypes, setTicketTypes] = useState<TicketTypeOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!eventId) return;

    const fetchTicketTypes = async () => {
      try {
        const q = query(
          collection(db, "ticketTypes"),
          where("eventId", "==", eventId)
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => {
          const d = doc.data();
          return {
            id: doc.id,
            name: d.name,
            description: d.description || "",
            price: d.price ?? null,
            maxEntryTime: d.maxEntryTime?.toDate?.() || null,
          };
        });
        setTicketTypes(data);
      } catch (error) {
        console.error("Error al cargar tipos de ticket:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTicketTypes();
  }, [eventId]);

  return {
    loading,
    ticketTypes,
  };
};

export default useTicketTypeOptions;
