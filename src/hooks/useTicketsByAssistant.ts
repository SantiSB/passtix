"use client";

import { useEffect, useState } from "react";
import { Ticket } from "@/interfaces/Ticket";
const useTicketsByAssistant = (assistantId: string | null) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTickets = async () => {
      if (!assistantId) return;

      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/assistants/${assistantId}/tickets`);
        const data = await res.json();

        if (data.success) {
          setTickets(data.tickets);
        } else {
          setError(data.error || "Error al cargar tickets");
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Error inesperado");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [assistantId]);

  return {
    tickets,
    loading,
    error,
  };
};

export default useTicketsByAssistant;
