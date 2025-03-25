import useCreateAssistantForm from "@/hooks/useCreateAssistantForm";

const CreateAssistantModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { form, loading, success, handleChange, handleSubmit } = useCreateAssistantForm();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg">
        <h1 className="text-2xl font-bold mb-6">Registrar asistente</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Nombre"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
          <input
            type="email"
            name="email"
            placeholder="Correo"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            name="cellPhone"
            placeholder="Celular"
            value={form.cellPhone}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            name="identificationCard"
            placeholder="Cédula"
            value={form.identificationCard}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          <select
            name="ticketType"
            value={form.ticketType}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="" disabled>Seleccione una opción</option>
            <option value="General">General</option>
            <option value="VIP">VIP</option>
            <option value="Backstage">Backstage</option>
          </select>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Guardar asistente'}
          </button>

          {success && (
            <p className="text-green-600 text-sm font-semibold">✅ Asistente registrado con éxito</p>
          )}
        </form>

        <button onClick={onClose} className="mt-4 text-red-600">Cerrar</button>
      </div>
    </div>
  );
};

export default CreateAssistantModal; 