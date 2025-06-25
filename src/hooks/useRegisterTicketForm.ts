"use client";

import { useEffect, useState } from "react";
import useEventOptions from "@/hooks/useEventOptions";
import usePromoterOptions from "@/hooks/usePromoterOptions";
import useTicketTypeOptions from "@/hooks/useTicketTypeOptions";
import { useQueryClient } from "@tanstack/react-query";

const useRegisterTicketForm = (eventId: string) => {
  // Opciones dinámicas
  const {
    phases,
    localities,
    loading: loadingOptions,
  } = useEventOptions(eventId);
  const { promoters, loading: loadingPromoters } = usePromoterOptions(eventId);
  const { ticketTypes, loading: loadingTicketTypes } =
    useTicketTypeOptions(eventId);

  const queryClient = useQueryClient();

  // Estado del formulario
  const [form, setForm] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    identificationNumber: "",
    identificationType: "",
    ticketTypeId: "",
    localityId: "",
    phaseId: "",
    promoterId: "",
    price: 0,
    maxEntryTime: null as Date | null,
  });

  // Estados de control
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calcular precio y hora de entrada máxima
  useEffect(() => {
    const selectedType = ticketTypes.find((t) => t.id === form.ticketTypeId);
    const selectedPhase = phases.find((p) => p.id === form.phaseId);
    const price =
      selectedType && typeof selectedType.price === "number"
        ? selectedType.price
        : (selectedPhase?.price ?? 0);

    const typeTime = selectedType?.maxEntryTime?.getTime?.() ?? Infinity;
    const phaseTime = selectedPhase?.maxEntryTime?.getTime?.() ?? Infinity;

    const earliestTime =
      typeTime === Infinity && phaseTime === Infinity
        ? null
        : new Date(Math.min(typeTime, phaseTime));

    setForm((prev) => ({
      ...prev,
      price,
      maxEntryTime: earliestTime,
    }));
  }, [form.ticketTypeId, form.phaseId, ticketTypes, phases]);

  // Cambios en campos del formulario
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(null);

    // Obtener el nombre del tipo de ticket seleccionado
    const selectedType = ticketTypes.find((t) => t.id === form.ticketTypeId);
    const ticketTypeName = selectedType?.name || "";


    try {
      const res = await fetch("/api/register-ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, eventId, ticketTypeName }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) throw new Error(json.error || "Error");

      setSuccess(true);
      queryClient.invalidateQueries({ 
        queryKey: ["tickets"],
        refetchType: "all"
      });

      setForm({
        name: "",
        email: "",
        phoneNumber: "",
        identificationNumber: "",
        identificationType: "",
        ticketTypeId: "",
        localityId: "",
        phaseId: "",
        promoterId: "",
        price: 0,
        maxEntryTime: null,
      });
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
    ticketTypes,
    loadingOptions,
    loadingPromoters,
    loadingTicketTypes,
  };
};

export default useRegisterTicketForm;
