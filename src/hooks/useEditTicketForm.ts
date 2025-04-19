"use client";

import { useState, useEffect } from "react";
import { Phase } from "@/interfaces/Phase";
import { EnrichedTicket } from "@/interfaces/EnrichedTicket";
import useEventOptions from "@/hooks/useEventOptions";
import usePromoterOptions from "@/hooks/usePromoterOptions";
import { useQueryClient } from "@tanstack/react-query";

const useEditTicketForm = (initialTicket: EnrichedTicket, eventId: string) => {
  // Hooks para obtener las opciones de los inputs de eventos y promotores
  const { phases, localities, loading: loadingOptions } = useEventOptions();
  const { promoters, loading: loadingPromoters } = usePromoterOptions();

  const queryClient = useQueryClient();

  // Estado del formulario
  const [form, setForm] = useState(initialTicket);

  // Estado de la carga, éxito y error
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cambia el precio del ticket según la fase seleccionada
  useEffect(() => {
    const selectedPhase = phases.find((p: Phase) => p.name === form.phaseName);
    if (selectedPhase?.price !== undefined) {
      setForm((prev) => ({ ...prev, price: selectedPhase.price }));
    }
  }, [form.phaseName, phases]);

  // Cambia el valor de un input
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Envía el formulario
  const handleSubmit = async (e: React.FormEvent) => {
    // Prevenir el envío del formulario
    e.preventDefault();

    // Iniciar el proceso de carga
    setLoading(true);
    setSuccess(false);
    setError(null);

    // Intentar actualizar el ticket
    try {
      const res = await fetch(`/api/update-ticket/${form.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, eventId }),
      });

      // Obtener la respuesta
      const json = await res.json();

      // Si la respuesta no es exitosa, lanzar un error
      if (!res.ok || !json.success) throw new Error(json.error || "Error");

      // Si la respuesta es exitosa, indicar éxito
      setSuccess(true);
      queryClient.invalidateQueries({ queryKey: ["tickets"] });

    } catch (err) {
      // Si hay un error, mostrarlo
      const error = err instanceof Error ? err.message : "Error desconocido";
      setError(error);
    } finally {
      // Finalizar el proceso de carga
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