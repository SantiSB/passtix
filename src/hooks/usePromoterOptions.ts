"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

type Option = {
  id: string;
  name: string;
};

const usePromoterOptions = (eventId: string) => {
  const [promoters, setPromoters] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!eventId) return;

    const fetchPromoters = async () => {
      try {
        const q = query(
          collection(db, "promoter"),
          where("eventId", "==", eventId)
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
        }));
        // Ordenar promotores alfabéticamente por nombre
        const sortedData = data.sort((a, b) => a.name.localeCompare(b.name));
        setPromoters(sortedData);
      } catch (error) {
        console.error("Error al cargar promotores:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPromoters();
  }, [eventId]);

  return {
    loading,
    promoters,
  };
};

export default usePromoterOptions;
