"use client";

import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import useAuth from "@/hooks/useAuth";
import { Timestamp } from "firebase/firestore";
export interface EventData {
  id: string;
  name: string;
  location: string;
  date: Timestamp;
  producerId: string;
  createdAt: string;
}

export default function useEventsByProducer() {
  const { user } = useAuth();
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      if (!user) return;

      try {
        // Usamos directamente el UID del usuario como producerId
        const eventsQuery = query(
          collection(db, "event"),
          where("producerId", "==", user.uid)
        );

        const eventSnap = await getDocs(eventsQuery);

        const eventsData = eventSnap.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<EventData, "id">),
        }));

        setEvents(eventsData);
      } catch (err) {
        console.error("Error cargando eventos:", err);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [user]);

  return { events, loading };
}
