"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase/firebase";
import { collection, getDocs } from "firebase/firestore";

type Option = {
  id: string;
  name: string;
};

const usePromoterOptions = () => {
  const [promoters, setPromoters] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPromoters = async () => {
      try {
        const snapshot = await getDocs(collection(db, "promoter"));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
        }));
        setPromoters(data);
      } catch (error) {
        console.error("Error al cargar promotores:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPromoters();
  }, []);

  return {
    loading,
    promoters,
  };
};

export default usePromoterOptions;
