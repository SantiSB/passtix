"use client";

import { useEffect, useState } from "react";
import { Ticket } from "@/interfaces/Ticket";

const useTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await fetch("/api/tickets");
        const data = await res.json();

        if (data.success) {
          setTickets(data.tickets);
        } else {
          setError(data.error || "Error al cargar tickets");
        }
      } catch (err) {
        console.error(err);
        setError("Error inesperado al cargar tickets");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  return { tickets, loading, error };
};

export default useTickets;
