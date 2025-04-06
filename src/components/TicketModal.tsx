"use client";

import useRegisterTicketForm from "@/hooks/useRegisterTicketForm";
import useEditTicketForm from "@/hooks/useEditTicketForm";
import TextInput from "./common/TextInput";
import SelectInput from "./common/SelectInput";
import FormActions from "./common/FormActions";
import { SuccessMessage, ErrorMessage } from "./common/Messages";
import { EnrichedTicket } from "@/interfaces/EnrichedTicket";

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  ticket?: EnrichedTicket;
}

const TicketModal = ({ isOpen, onClose, mode, ticket }: TicketModalProps) => {
  // Elegir el hook correspondiente según el modo del modal
  const formHook =
    mode === "edit" && ticket
      ? useEditTicketForm(ticket)
      : useRegisterTicketForm();

  const {
    form,
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
  } = formHook;

  // Evitar cierre accidental al hacer clic fuera del modal
  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm transition-opacity duration-300 ease-in-out z-50">
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto animate-fadeIn"
        onClick={stopPropagation}
      >
        {/* Modal Header */}
        <div className="sticky top-0 bg-white flex items-center justify-between px-6 py-4 border-b border-gray-200 z-10">
          <h1 className="text-xl font-bold text-gray-900">
            {mode === "edit" ? "Editar Ticket" : "Registrar asistente"}
          </h1>
          <button
            className="text-gray-600 hover:text-gray-900 transition"
            onClick={onClose}
          >
            ❌
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-5">
          {[
            {
              label: "Nombre",
              name: "name",
              required: true,
            },
            {
              label: "Correo Electrónico",
              name: "email",
              required: true,
              type: "email",
            },
            {
              label: "Celular",
              name: "phoneNumber",
            },
            {
              label: "Número de documento",
              name: "identificationNumber",
              required: true,
            },
          ].map(({ label, name, type = "text", required }) => (
            <TextInput
              key={name}
              label={label}
              name={name}
              type={type}
              required={required}
              value={form[name as keyof typeof form] as string}
              onChange={handleChange}
            />
          ))}

          <SelectInput
            label="Tipo de documento"
            name="identificationType"
            value={form.identificationType}
            onChange={handleChange}
            options={[
              { id: "cc", name: "Cédula" },
              { id: "ce", name: "Cédula extranjería" },
              { id: "pasaporte", name: "Pasaporte" },
              { id: "otro", name: "Otro" },
            ]}
            required
          />

          <SelectInput
            label="Tipo de ticket"
            name="ticketType"
            value={form.ticketType}
            onChange={handleChange}
            options={[
              { id: "ticket", name: "Boleta" },
              { id: "courtesy", name: "Cortesía" },
            ]}
            required
          />

          <SelectInput
            label="Localidad"
            name="localityId"
            value={form.localityId}
            onChange={handleChange}
            options={localities}
            required
          />

          <SelectInput
            label="Etapa"
            name="phaseId"
            value={form.phaseId}
            onChange={handleChange}
            options={phases}
            required
          />

          <SelectInput
            label="Promotor"
            name="promoterId"
            value={form.promoterId || ""}
            onChange={handleChange}
            options={promoters}
          />

          <FormActions
            onClose={onClose}
            loading={loading}
            loadingOptions={loadingOptions}
            loadingPromoters={loadingPromoters}
          />

          {success && (
            <SuccessMessage
              message={
                mode === "edit"
                  ? "Ticket actualizado con éxito."
                  : "Asistente y ticket registrados con éxito."
              }
            />
          )}
          {error && <ErrorMessage message={error} />}
        </form>
      </div>
    </div>
  );
};

export default TicketModal;
