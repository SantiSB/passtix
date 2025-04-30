"use client";

import { useState } from "react";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";

interface Props {
  eventId: string;
  isOpen: boolean;
  onClose: () => void;
}

const PromoterModal: React.FC<Props> = ({ eventId, isOpen, onClose }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [identificationType, setIdentificationType] = useState("");
  const [identificationId, setIdentificationId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await addDoc(collection(db, "promoter"), {
        eventId,
        name,
        email: email || null,
        phone: phone || null,
        identificationType: identificationType || null,
        identificationId: identificationId || null,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      setSuccess(true);
      setName("");
      setEmail("");
      setPhone("");
      setIdentificationType("");
      setIdentificationId("");
      onClose();
    } catch (err) {
      console.error("Error al crear el promotor:", err);
      setError("Error al crear el promotor.");
    } finally {
      setLoading(false);
    }
  };

  /* Evitar cierre por clic fuera */
  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm transition-opacity duration-300 ease-in-out z-50">
      <div
        className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto animate-fadeIn text-white"
        onClick={stopPropagation}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 flex items-center justify-between px-6 py-4 border-b border-gray-700 z-10">
          <h1 className="text-xl font-bold text-white">Crear Promotor</h1>
          <button
            className="text-gray-400 hover:text-white transition"
            onClick={onClose}
          >
            ❌
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-300">Nombre *</label>
            <input
              type="text"
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white focus:border-emerald-500 focus:ring-emerald-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Ej. Juan Pérez"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-300">Correo</label>
            <input
              type="email"
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white focus:border-emerald-500 focus:ring-emerald-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="promotor@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-300">Celular</label>
            <input
              type="tel"
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white focus:border-emerald-500 focus:ring-emerald-500"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="3001234567"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-300">
              Tipo de identificación
            </label>
            <select
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white focus:border-emerald-500 focus:ring-emerald-500"
              value={identificationType}
              onChange={(e) => setIdentificationType(e.target.value)}
            >
              <option value="" className="text-gray-500">Selecciona un tipo</option>
              <option value="CC" className="bg-gray-800">Cédula de ciudadanía</option>
              <option value="CE" className="bg-gray-800">Cédula de extranjería</option>
              <option value="PA" className="bg-gray-800">Pasaporte</option>
              <option value="TI" className="bg-gray-800">Tarjeta de identidad</option>
              <option value="NIT" className="bg-gray-800">NIT</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-300">
              Número de identificación
            </label>
            <input
              type="text"
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white focus:border-emerald-500 focus:ring-emerald-500"
              value={identificationId}
              onChange={(e) => setIdentificationId(e.target.value)}
              placeholder="Ej. 1234567890"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}
          {success && (
            <p className="text-green-400 text-sm">Promotor creado ✅</p>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-4 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded bg-emerald-600 text-white font-semibold hover:bg-emerald-700 disabled:opacity-50 text-sm"
            >
              {loading ? "Creando..." : "Crear promotor"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PromoterModal;
