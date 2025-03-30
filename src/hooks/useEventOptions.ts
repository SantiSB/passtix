"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Phase } from "@/interfaces/Phase";

type Option = {
  id: string;
  name: string;
};

const useEventOptions = () => {
  const [events, setEvents] = useState<Option[]>([]);
  const [phases, setPhases] = useState<Phase[]>([]);
  const [localities, setLocalities] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [eventsSnap, phasesSnap, localitiesSnap] = await Promise.all([
          getDocs(collection(db, "event")),
          getDocs(collection(db, "phase")),
          getDocs(collection(db, "locality")),
        ]);

        setEvents(
          eventsSnap.docs.map((doc) => ({
            id: doc.id,
            name: doc.data().name,
          }))
        );

        setPhases(
          phasesSnap.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              name: data.name,
              eventId: data.eventId,
              price: data.price,
              order: data.order,
              isActive: data.isActive,
              startDate: data.startDate?.toDate?.() ?? null,
              endDate: data.endDate?.toDate?.() ?? null,
              createdAt: data.createdAt?.toDate?.() ?? new Date(),
              updatedAt: data.updatedAt?.toDate?.() ?? new Date(),
            };
          })
        );

        setLocalities(
          localitiesSnap.docs.map((doc) => ({
            id: doc.id,
            name: doc.data().name,
          }))
        );
      } catch (error) {
        console.error("Error al cargar eventos/fases/localidades:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, []);

  return {
    loading,
    events,
    phases,
    localities,
  };
};

export default useEventOptions;
