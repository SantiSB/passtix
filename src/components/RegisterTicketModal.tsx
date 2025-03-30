"use client";

import { useState, useEffect } from "react";
import useEventOptions from "@/hooks/useEventOptions";
import usePromoterOptions from "@/hooks/usePromoterOptions";
import { Phase } from "@/interfaces/Phase";

const DEFAULT_EVENT_ID = "kZEZ4x42RtwELpkO3dEf";

const RegisterTicketModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
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

  // Actualiza el precio según la fase seleccionada
  useEffect(() => {
    const selectedPhase = phases.find((p: Phase) => p.id === form.phaseId);
    if (selectedPhase && selectedPhase.price !== undefined) {
      setForm((prev) => ({ ...prev, price: selectedPhase.price }));
    }
  }, [form.phaseId, phases]);

  if (!isOpen) return null;

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
        body: JSON.stringify({
          ...form,
          eventId: DEFAULT_EVENT_ID,
        }),
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
    } catch (err: any) {
      setError(err.message || "Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  const handleOutsideClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center ${
        isOpen
          ? "opacity-100 backdrop-blur-sm"
          : "opacity-0 pointer-events-none"
      } transition-opacity duration-300 ease-in-out`}
      onClick={handleOutsideClick}
    >
      <div className="bg-white p-8 rounded-lg shadow-2xl max-w-lg w-full mx-4 border border-gray-300 max-h-[90vh] overflow-y-auto">
        <h1 className="text-3xl font-extrabold mb-6 text-gray-900">
          Registrar asistente
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campos de texto */}
          {[
            { label: "Nombre", name: "name", required: true },
            {
              label: "Correo Electrónico",
              name: "email",
              required: true,
              type: "email",
            },
            { label: "Celular", name: "phoneNumber" },
            {
              label: "Número de documento",
              name: "identificationNumber",
              required: true,
            },
          ].map(({ label, name, type = "text", required }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
              </label>
              <input
                type={type}
                name={name}
                required={required}
                value={form[name as keyof typeof form]}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-md"
              />
            </div>
          ))}

          {/* Selects */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Tipo de documento
            </label>
            <select
              name="identificationType"
              value={form.identificationType}
              onChange={handleChange}
              required
              className="w-full border p-3 rounded-md bg-white"
            >
              <option value="">Selecciona</option>
              <option value="cc">Cédula</option>
              <option value="ce">Cédula extranjería</option>
              <option value="pasaporte">Pasaporte</option>
              <option value="otro">Otro</option>
            </select>

            <label className="block text-sm font-medium text-gray-700">
              Tipo de ticket
            </label>
            <select
              name="ticketType"
              value={form.ticketType}
              onChange={handleChange}
              required
              className="w-full border p-3 rounded-md bg-white"
            >
              <option value="">Selecciona</option>
              <option value="ticket">Boleta</option>
              <option value="courtesy">Cortesía</option>
            </select>

            <label className="block text-sm font-medium text-gray-700">
              Localidad
            </label>
            <select
              name="localityId"
              value={form.localityId}
              onChange={handleChange}
              required
              className="w-full border p-3 rounded-md bg-white"
            >
              <option value="">Selecciona</option>
              {localities.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </select>

            <label className="block text-sm font-medium text-gray-700">
              Etapa
            </label>
            <select
              name="phaseId"
              value={form.phaseId}
              onChange={handleChange}
              required
              className="w-full border p-3 rounded-md bg-white"
            >
              <option value="">Selecciona</option>
              {phases.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>

            <label className="block text-sm font-medium text-gray-700">
              Promotor
            </label>
            <select
              name="promoterId"
              value={form.promoterId}
              onChange={handleChange}
              className="w-full border p-3 rounded-md bg-white"
            >
              <option value="">Sin promotor</option>
              {promoters.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Acciones */}
          <div className="flex justify-between mt-6">
            <button
              type="submit"
              disabled={loading || loadingOptions || loadingPromoters}
              className="bg-emerald-800 text-white px-5 py-2 rounded-md hover:bg-emerald-700"
            >
              {loading ? "Registrando..." : "Registrar"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-red-800 text-white px-5 py-2 rounded-md hover:bg-red-700"
            >
              Cerrar
            </button>
          </div>

          {success && (
            <p className="text-emerald-700 font-semibold text-sm mt-4">
              ✅ Asistente y ticket registrados con éxito.
            </p>
          )}
          {error && (
            <p className="text-red-600 font-medium text-sm mt-2">❌ {error}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default RegisterTicketModal;
