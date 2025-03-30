"use client";

import useRegisterTicketForm from "@/hooks/useRegisterTicketForm";
import TextInput from './TextInput';
import SelectInput from './SelectInput';
import FormActions from './FormActions';
import { SuccessMessage, ErrorMessage } from './Messages';

const RegisterTicketModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
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
  } = useRegisterTicketForm();

  const handleOutsideClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!isOpen) return null;

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
            value={form.promoterId}
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

          {success && <SuccessMessage message="Asistente y ticket registrados con éxito." />}
          {error && <ErrorMessage message={error} />}
        </form>
      </div>
    </div>
  );
};

export default RegisterTicketModal;
