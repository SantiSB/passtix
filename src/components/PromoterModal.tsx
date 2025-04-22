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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-xl max-w-md w-full shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-center">Crear Promotor</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Nombre *</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Ej. Juan Pérez"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Correo</label>
            <input
              type="email"
              className="w-full p-2 border rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="promotor@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Celular</label>
            <input
              type="tel"
              className="w-full p-2 border rounded"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="3001234567"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Tipo de identificación
            </label>
            <select
              className="w-full p-2 border rounded"
              value={identificationType}
              onChange={(e) => setIdentificationType(e.target.value)}
            >
              <option value="">Selecciona un tipo</option>
              <option value="CC">Cédula de ciudadanía</option>
              <option value="CE">Cédula de extranjería</option>
              <option value="PA">Pasaporte</option>
              <option value="TI">Tarjeta de identidad</option>
              <option value="NIT">NIT</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Número de identificación
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={identificationId}
              onChange={(e) => setIdentificationId(e.target.value)}
              placeholder="Ej. 1234567890"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && (
            <p className="text-green-600 text-sm">Promotor creado ✅</p>
          )}

          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 text-black px-4 py-2 rounded"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600 disabled:opacity-50"
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
