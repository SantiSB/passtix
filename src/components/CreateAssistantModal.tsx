'use client';

import useCreateAssistantForm from '@/hooks/useCreateAssistantForm';
import useEventOptions from '@/hooks/useEventOptions';
import usePromoterOptions from '@/hooks/usePromoterOptions';

const CreateAssistantModal = ({
  isOpen,
  onClose
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const {
    form,
    loading,
    success,
    handleChange,
    handleSubmit
  } = useCreateAssistantForm();

  const { loading: loadingOptions, events, phases, localities } = useEventOptions();
  const { loading: loadingPromoters, promoters } = usePromoterOptions();

  if (!isOpen) return null;

  const handleOutsideClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100 backdrop-blur-sm' : 'opacity-0 pointer-events-none'}`}
      onClick={handleOutsideClick}
    >
      <div className="bg-white p-6 rounded-lg shadow-2xl max-w-md w-full mx-4 border border-gray-300">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Registrar asistente
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="name" placeholder="Nombre" value={form.name} onChange={handleChange} required className="w-full input" />
          <input type="email" name="email" placeholder="Correo" value={form.email} onChange={handleChange} required className="w-full input" />
          <input type="text" name="cellPhone" placeholder="Celular" value={form.cellPhone} onChange={handleChange} className="w-full input" />
          <input type="text" name="identificationNumber" placeholder="Número de documento" value={form.identificationNumber} onChange={handleChange} required className="w-full input" />

          <select name="identificationType" value={form.identificationType} onChange={handleChange} className="w-full input">
            <option value="cc">Cédula</option>
            <option value="ce">Cédula extranjería</option>
            <option value="pasaporte">Pasaporte</option>
            <option value="otro">Otro</option>
          </select>

          <select name="ticketType" value={form.ticketType} onChange={handleChange} className="w-full input">
            <option value="ticket">Ticket</option>
            <option value="courtesy">Cortesía</option>
          </select>

          {/* Selects dinámicos desde Firestore */}
          <select name="eventId" value={form.eventId} onChange={handleChange} required className="w-full input">
            <option value="">Selecciona un evento</option>
            {events.map((e) => (
              <option key={e.id} value={e.id}>{e.name}</option>
            ))}
          </select>

          <select name="phaseId" value={form.phaseId} onChange={handleChange} required className="w-full input">
            <option value="">Selecciona una fase</option>
            {phases.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <select name="localityId" value={form.localityId} onChange={handleChange} required className="w-full input">
            <option value="">Selecciona una localidad</option>
            {localities.map((l) => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </select>

          <input type="number" name="price" placeholder="Precio del ticket" value={form.price} onChange={handleChange} required className="w-full input" />

          <select name="promoterId" value={form.promoterId} onChange={handleChange} className="w-full input">
            <option value="">Selecciona un promotor (opcional)</option>
            {promoters.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <select name="deliveryMethod" value={form.deliveryMethod} onChange={handleChange} className="w-full input">
            <option value="manual">Entrega manual</option>
            <option value="email">Email</option>
            <option value="whatsapp">WhatsApp</option>
          </select>

          <input type="text" name="discountId" placeholder="ID del descuento (opcional)" value={form.discountId} onChange={handleChange} className="w-full input" />
          <input type="number" name="discountAmount" placeholder="Valor del descuento" value={form.discountAmount} onChange={handleChange} className="w-full input" />

          <div className="flex space-x-4">
            <button type="submit" className="btn bg-emerald-800 hover:bg-emerald-700 text-white" disabled={loading || loadingOptions || loadingPromoters}>
              {loading ? 'Registrando...' : 'Registrar'}
            </button>
            <button type="button" onClick={onClose} className="btn bg-red-800 hover:bg-red-700 text-white">
              Cerrar
            </button>
          </div>

          {success && <p className="text-emerald-800 text-sm font-semibold">✅ Asistente registrado con éxito</p>}
        </form>
      </div>
    </div>
  );
};

export default CreateAssistantModal;
