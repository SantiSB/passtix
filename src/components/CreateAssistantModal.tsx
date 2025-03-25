import useCreateAssistantForm from "@/hooks/useCreateAssistantForm";

const CreateAssistantModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { form, loading, success, handleChange, handleSubmit } = useCreateAssistantForm();

  if (!isOpen) return null;

  // Add a transition to the modal for smooth opening and closing
  const modalTransition = "transition-opacity duration-300 ease-in-out";

  // Add an event listener to close the modal when clicking outside
  const handleOutsideClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center ${modalTransition} ${isOpen ? 'opacity-100 backdrop-blur-xs' : 'opacity-0 pointer-events-none'}`}
      onClick={handleOutsideClick}
    >
      <div className="bg-white p-6 rounded-lg shadow-2xl max-w-md w-full mx-4 border border-gray-300">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Registrar asistente</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Nombre"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            name="email"
            placeholder="Correo"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="cellPhone"
            placeholder="Celular"
            value={form.cellPhone}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="identificationCard"
            placeholder="Cédula"
            value={form.identificationCard}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            name="ticketType"
            value={form.ticketType}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>Seleccione una opción</option>
            <option value="General">General</option>
            <option value="VIP">VIP</option>
            <option value="Backstage">Backstage</option>
          </select>

          <div className="flex space-x-4">
            <button
              type="submit"
              className="bg-emerald-800 text-white px-4 py-3 rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition duration-300 ease-in-out"
              disabled={loading}
            >
              {loading ? 'Registrando...' : 'Registrar'}
            </button>

            <button onClick={onClose} className="bg-red-800 text-white px-4 py-3 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-300 ease-in-out">
              Cerrar
            </button>
          </div>

          {success && (
            <p className="text-emerald-800 text-sm font-semibold">✅ Asistente registrado con éxito</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreateAssistantModal; 