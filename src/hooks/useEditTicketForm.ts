"use client";

import { useState, useEffect } from "react";
import { EnrichedTicket } from "@/interfaces/EnrichedTicket";
import useEventOptions from "@/hooks/useEventOptions";
import usePromoterOptions from "@/hooks/usePromoterOptions";
import { useQueryClient } from "@tanstack/react-query";

const useEditTicketForm = (initialTicket: EnrichedTicket, eventId: string) => {
  const {
    phases,
    localities,
    loading: loadingOptions,
  } = useEventOptions(eventId);
  const { promoters, loading: loadingPromoters } = usePromoterOptions(eventId);

  const queryClient = useQueryClient();

  const [form, setForm] = useState(initialTicket);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Actualiza el precio si se cambia la fase
  useEffect(() => {
    const selectedPhase = phases.find((p) => p.id === form.phaseId);
    if (selectedPhase?.price !== undefined) {
      setForm((prev) => ({ ...prev, price: selectedPhase.price }));
    }
  }, [form.phaseId, phases]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      const res = await fetch(`/api/update-ticket/${form.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, eventId }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) throw new Error(json.error || "Error");

      setSuccess(true);
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    } catch (err) {
      const error = err instanceof Error ? err.message : "Error desconocido";
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    setForm,
    loading,
    success,
    error,
    handleChange,
    handleSubmit,
    phases,
    localities,
    promoters,
    loadingOptions,
    loadingPromoters,
  };
};

export default useEditTicketForm;
