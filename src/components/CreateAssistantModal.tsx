"use client";

import useCreateAssistantForm from "@/hooks/useCreateAssistantForm";
import useEventOptions from "@/hooks/useEventOptions";
import usePromoterOptions from "@/hooks/usePromoterOptions";

const CreateAssistantModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { form, loading, success, handleChange, handleSubmit } =
    useCreateAssistantForm();

  const { loading: loadingOptions, phases, localities } = useEventOptions();
  const { loading: loadingPromoters, promoters } = usePromoterOptions();

  if (!isOpen) return null;

  const handleOutsideClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center transition-opacity duration-300 ease-in-out ${
        isOpen
          ? "opacity-100 backdrop-blur-sm"
          : "opacity-0 pointer-events-none"
      }`}
      onClick={handleOutsideClick}
    >
      <div className="bg-white p-8 rounded-lg shadow-2xl max-w-lg w-full mx-4 border border-gray-300 max-h-[90vh] overflow-y-auto">
        <h1 className="text-3xl font-extrabold mb-6 text-gray-900">
          Registrar asistente
        </h1>

        <style jsx>{`
          .select-with-arrow {
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>');
            background-repeat: no-repeat;
            background-position: right 0.75rem center;
            background-size: 1rem;
            padding-right: 2.5rem;
          }
        `}</style>

        <form onSubmit={handleSubmit} className="space-y-6">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Nombre
          </label>
          <input
            type="text"
            name="name"
            placeholder="Nombre"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full input focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-md border border-gray-300 p-3"
          />
          <label
            htmlFor="identificationNumber"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Número de documento
          </label>
          <input
            type="text"
            name="identificationNumber"
            placeholder="Número de documento"
            value={form.identificationNumber}
            onChange={handleChange}
            required
            className="w-full input focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-md border border-gray-300 p-3"
          />
          <label
            htmlFor="identificationType"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Tipo de documento
          </label>
          <select
            name="identificationType"
            value={form.identificationType}
            onChange={handleChange}
            className="w-full input select-with-arrow focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-md border border-gray-300 p-3 bg-white hover:bg-gray-50 appearance-none relative"
          >
            <option value="" disabled hidden className="text-gray-500">
              Selecciona un tipo de documento
            </option>
            <option value="cc">Cédula</option>
            <option value="ce">Cédula extranjería</option>
            <option value="pasaporte">Pasaporte</option>
            <option value="otro">Otro</option>
          </select>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Correo Electrónico
          </label>
          <input
            type="email"
            name="email"
            placeholder="Correo Electrónico"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full input focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-md border border-gray-300 p-3"
          />
          <label
            htmlFor="phoneNumber"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Celular
          </label>
          <input
            type="text"
            name="phoneNumber"
            placeholder="Celular"
            value={form.phoneNumber}
            onChange={handleChange}
            className="w-full input focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-md border border-gray-300 p-3"
          />

          <label
            htmlFor="ticketType"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Tipo
          </label>
          <select
            name="ticketType"
            value={form.ticketType}
            onChange={handleChange}
            className="w-full input select-with-arrow focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-md border border-gray-300 p-3 bg-white hover:bg-gray-50 appearance-none relative"
          >
            <option value="" disabled hidden className="text-gray-500">
              Selecciona un tipo de ticket
            </option>
            <option value="ticket">Boleta</option>
            <option value="courtesy">Cortesía</option>
          </select>
          <label
            htmlFor="localityId"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Localidad
          </label>
          <select
            name="localityId"
            value={form.localityId}
            onChange={handleChange}
            required
            className="w-full input select-with-arrow focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-md border border-gray-300 p-3 bg-white hover:bg-gray-50 appearance-none relative"
          >
            {localities.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
          <label
            htmlFor="phaseId"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Etapa
          </label>
          <select
            name="phaseId"
            value={form.phaseId}
            onChange={handleChange}
            required
            className="w-full input select-with-arrow focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-md border border-gray-300 p-3 bg-white hover:bg-gray-50 appearance-none relative"
          >
            {phases.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <label
            htmlFor="promoterId"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Promotor
          </label>
          <select
            name="promoterId"
            value={form.promoterId}
            onChange={handleChange}
            className="w-full input select-with-arrow focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-md border border-gray-300 p-3 bg-white hover:bg-gray-50 appearance-none relative"
          >
            {promoters.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <div className="flex space-x-4">
            <button
              type="submit"
              className="btn bg-emerald-800 hover:bg-emerald-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-md px-4 py-2"
              disabled={loading || loadingOptions || loadingPromoters}
            >
              {loading ? "Registrando..." : "Registrar"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn bg-red-800 hover:bg-red-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500 rounded-md px-4 py-2"
            >
              Cerrar
            </button>
          </div>

          {success && (
            <p className="text-emerald-800 text-sm font-semibold mt-4">
              ✅ Asistente registrado con éxito
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreateAssistantModal;
