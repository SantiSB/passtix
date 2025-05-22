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
  mode: "create" | "edit" | "delete";
  ticket?: EnrichedTicket;
  eventId: string;
  onConfirmDelete?: () => void;
  loadingDelete?: boolean;
  errorDelete?: string | null;
}

const TicketModal = ({
  isOpen,
  onClose,
  mode,
  ticket,
  onConfirmDelete,
  loadingDelete,
  errorDelete,
  eventId,
}: TicketModalProps) => {
  const editFormHook = useEditTicketForm(
    ticket || ({} as EnrichedTicket),
    eventId
  );
  const registerFormHook = useRegisterTicketForm(eventId);
  const formHook = mode === "edit" && ticket ? editFormHook : registerFormHook;

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

  const ticketTypes =
    mode === "create" && "ticketTypes" in formHook ? formHook.ticketTypes : [];

  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm transition-opacity duration-300 ease-in-out z-50">
      <div
        className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto animate-fadeIn text-white"
        onClick={stopPropagation}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 flex items-center justify-between px-6 py-4 border-b border-gray-700 z-10">
          <h1 className="text-xl font-bold text-white">
            {mode === "edit"
              ? "Editar Ticket"
              : mode === "delete"
                ? "Confirmar Eliminación"
                : "Registrar asistente"}
          </h1>
          <button
            className="text-gray-400 hover:text-white transition"
            onClick={onClose}
          >
            ❌
          </button>
        </div>

        {/* DELETE MODE */}
        {mode === "delete" && ticket ? (
          <div className="px-6 py-6 space-y-6">
            <p className="text-gray-300">
              ¿Estás seguro de que deseas eliminar el ticket de{" "}
              <strong className="text-white">{ticket.name}</strong>?
            </p>

            {errorDelete && <ErrorMessage message={errorDelete} />}

            <div className="flex justify-end gap-4">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={onConfirmDelete}
                disabled={loadingDelete}
                className="px-4 py-2 rounded bg-red-700 hover:bg-red-800 text-white text-sm disabled:opacity-50"
              >
                {loadingDelete ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        ) : (
          // CREATE / EDIT FORM
          <form onSubmit={handleSubmit} className="px-6 py-4 space-y-5">
            {[
              { label: "Nombre", name: "name", required: true },
              {
                label: "Correo Electrónico",
                name: "email",
                type: "email",
                required: true,
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

            <TextInput
              label="Celular"
              name="phoneNumber"
              type="tel"
              value={form.phoneNumber}
              onChange={handleChange}
            />

            {mode === "create" && (
              <SelectInput
                label="Tipo de ticket"
                name="ticketTypeId"
                value={form.ticketTypeId}
                onChange={handleChange}
                options={ticketTypes.map((t) => ({
                  id: t.id,
                  name: t.name,
                }))}
              />
            )}

            <SelectInput
              label="Localidad"
              name="localityId"
              value={form.localityId}
              onChange={handleChange}
              options={localities}
            />

            <SelectInput
              label="Etapa"
              name="phaseId"
              value={form.phaseId}
              onChange={handleChange}
              options={phases}
            />

            <SelectInput
              label="Promotor"
              name="promoterId"
              value={form.promoterId || ""}
              onChange={handleChange}
              options={promoters}
            />

            {/* Mostrar precio calculado al final, como texto pequeño y estilizado */}
            <div className="mt-4 text-left">
              <span
                className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${
                  (form.price ?? 0) > 0
                    ? 'bg-emerald-900 text-emerald-300'
                    : 'bg-gray-700 text-gray-400'
                }`}
              >
                Precio: {typeof form.price === 'number' ? `$${form.price}` : '—'}
              </span>
            </div>

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
        )}
      </div>
    </div>
  );
};

export default TicketModal;
