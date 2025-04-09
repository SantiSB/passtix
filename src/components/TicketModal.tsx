"use client";

import useRegisterTicketForm from "@/hooks/useRegisterTicketForm";
import useEditTicketForm from "@/hooks/useEditTicketForm";
import TextInput from "./common/TextInput";
import SelectInput from "./common/SelectInput";
import FormActions from "./common/FormActions";
import { SuccessMessage, ErrorMessage } from "./common/Messages";
import { EnrichedTicket } from "@/interfaces/EnrichedTicket";

/* ────────────────────────────────────────────────────────────────────────── */
/* Tipos                                                                     */
/* ────────────────────────────────────────────────────────────────────────── */
interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit" | "delete";
  ticket?: EnrichedTicket;
  /* Props para modo delete */
  onConfirmDelete?: () => void;
  loadingDelete?: boolean;
  errorDelete?: string | null;
}

/* ────────────────────────────────────────────────────────────────────────── */
/* Componente                                                                */
/* ────────────────────────────────────────────────────────────────────────── */
const TicketModal = ({
  isOpen,
  onClose,
  mode,
  ticket,
  onConfirmDelete,
  loadingDelete,
  errorDelete,
}: TicketModalProps) => {
  /* Hooks de formulario */
  const editFormHook = useEditTicketForm(ticket || ({} as EnrichedTicket));
  const registerFormHook = useRegisterTicketForm();
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

  /* Evitar cierre por clic fuera */
  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();
  if (!isOpen) return null;

  /* ────────────────────────────────────────────────────────────────────── */
  /* Render                                                                */
  /* ────────────────────────────────────────────────────────────────────── */
  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm transition-opacity duration-300 ease-in-out z-50">
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto animate-fadeIn"
        onClick={stopPropagation}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white flex items-center justify-between px-6 py-4 border-b border-gray-200 z-10">
          <h1 className="text-xl font-bold text-gray-900">
            {mode === "edit"
              ? "Editar Ticket"
              : mode === "delete"
                ? "Confirmar Eliminación"
                : "Registrar asistente"}
          </h1>
          <button
            className="text-gray-600 hover:text-gray-900 transition"
            onClick={onClose}
          >
            ❌
          </button>
        </div>

        {/* ───────────────────── MODO DELETE ───────────────────── */}
        {mode === "delete" && ticket ? (
          <div className="px-6 py-6 space-y-6">
            <p className="text-gray-800">
              ¿Estás seguro de que deseas eliminar el ticket de{" "}
              <strong>{ticket.name}</strong>?
            </p>

            {errorDelete && <ErrorMessage message={errorDelete} />}

            <div className="flex justify-end gap-4">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={onConfirmDelete}
                disabled={loadingDelete}
                className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white text-sm disabled:opacity-50"
              >
                {loadingDelete ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        ) : (
          /* ────────────────── MODO CREATE / EDIT ────────────────── */
          <form onSubmit={handleSubmit} className="px-6 py-4 space-y-5">
            {/* Campos texto */}
            {[
              { label: "Nombre", name: "name", required: true },
              {
                label: "Correo Electrónico",
                name: "email",
                required: true,
                type: "email",
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

            {/* Selects */}
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
              value={form.phoneNumber as string}
              onChange={handleChange}
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

            {/* Acciones */}
            <FormActions
              onClose={onClose}
              loading={loading}
              loadingOptions={loadingOptions}
              loadingPromoters={loadingPromoters}
            />

            {/* Mensajes */}
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
