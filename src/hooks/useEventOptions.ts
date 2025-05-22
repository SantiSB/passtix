"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Phase } from "@/interfaces/Phase";

type Option = {
  id: string;
  name: string;
};

const useEventOptions = (eventId: string | null) => {
  const [phases, setPhases] = useState<Phase[]>([]);
  const [localities, setLocalities] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!eventId) return;

    const fetchOptions = async () => {
      try {
        const [phasesSnap, localitiesSnap] = await Promise.all([
          getDocs(
            query(collection(db, "phase"), where("eventId", "==", eventId))
          ),
          getDocs(
            query(collection(db, "locality"), where("eventId", "==", eventId))
          ),
        ]);

        setPhases(
          phasesSnap.docs
            .map((doc) => {
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
                maxEntryTime: data.maxEntryTime?.toDate?.() ?? null, // 👈 agregado
                createdAt: data.createdAt?.toDate?.() ?? new Date(),
                updatedAt: data.updatedAt?.toDate?.() ?? new Date(),
              };
            })
            .filter((phase) => !eventId || phase.eventId === eventId)
            .sort((a, b) => a.order - b.order)
        );

        setLocalities(
          localitiesSnap.docs.map((doc) => ({
            id: doc.id,
            name: doc.data().name,
          }))
        );
      } catch (error) {
        console.error("Error al cargar fases/localidades:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, [eventId]);

  return {
    loading,
    phases,
    localities,
  };
};

export default useEventOptions;
