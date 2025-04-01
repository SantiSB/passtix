"use client";

import { useEffect, useState } from "react";
import { Phase } from "@/interfaces/Phase";
import useEventOptions from "@/hooks/useEventOptions";
import usePromoterOptions from "@/hooks/usePromoterOptions";
import { getTicket } from "@/lib/utils/ticket";
const DEFAULT_EVENT_ID = "kZEZ4x42RtwELpkO3dEf";

const useRegisterTicketForm = () => {
  const { phases, localities, loading: loadingOptions } = useEventOptions();
  const { promoters, loading: loadingPromoters } = usePromoterOptions();

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

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-set price from selected phase
  useEffect(() => {
    const selectedPhase = phases.find((p: Phase) => p.id === form.phaseId);
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
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, eventId: DEFAULT_EVENT_ID }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Error");

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

      const ticket = await getTicket(json.ticket.id);
      console.log(ticket);

      if (success) {
        await fetch("/api/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: form.name,
            eventName: "Bichiyal",
            eventDate: "2025-04-12",
            eventTime: "20:00",
            venueName: "Hotel V1501",
            venueAddress: "Cl 20 #33-60, Pasto",
            ticketStatus: "Confirmado",
            qrCodeUrl: ticket.qrCode,
            producerName: "Piso 12"
          }),
        });
      }
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

export default useRegisterTicketForm;
