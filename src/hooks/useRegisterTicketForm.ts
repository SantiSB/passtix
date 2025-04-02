"use client";

import { useEffect, useState } from "react";
import { Phase } from "@/interfaces/Phase";
import useEventOptions from "@/hooks/useEventOptions";
import usePromoterOptions from "@/hooks/usePromoterOptions";

const useRegisterTicketForm = () => {
  // Hooks para obtener las opciones de los inputs de eventos y promotores
  const { phases, localities, loading: loadingOptions } = useEventOptions();
  const { promoters, loading: loadingPromoters } = usePromoterOptions();

  // Estado del formulario
  const [form, setForm] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    identificationNumber: "",
    identificationType: "",
    ticketType: "",
    localityId: "",
    phaseId: "",
    promoterId: "",
    price: 0,
  });

  // Estado de la carga, éxito y error
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cambia el precio del ticket según la fase seleccionada
  useEffect(() => {
    const selectedPhase = phases.find((p: Phase) => p.id === form.phaseId);
    if (selectedPhase?.price !== undefined) {
      setForm((prev) => ({ ...prev, price: selectedPhase.price }));
    }
  }, [form.phaseId, phases]);

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

    // Intentar registrar el ticket
    try {
      const res = await fetch("/api/register-ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form }),
      });

      // Obtener la respuesta
      const json = await res.json();

      // Si la respuesta no es exitosa, lanzar un error
      if (!res.ok || !json.success) throw new Error(json.error || "Error");

      // Si la respuesta es exitosa, limpiar el formulario
      setSuccess(true);
      setForm({
        name: "",
        email: "",
        phoneNumber: "",
        identificationNumber: "",
        identificationType: "",
        ticketType: "",
        localityId: "",
        phaseId: "",
        promoterId: "",
        price: 0,
      });
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

export default useRegisterTicketForm;
