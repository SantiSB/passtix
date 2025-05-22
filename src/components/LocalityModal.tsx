"use client";

import { useState } from "react";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";

interface Props {
  eventId: string;
  isOpen: boolean;
  onClose: () => void;
}

const LocalityModal: React.FC<Props> = ({ eventId, isOpen, onClose }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [order, setOrder] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await addDoc(collection(db, "locality"), {
        name,
        description,
        order: Number(order),
        isActive,
        eventId,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      setSuccess(true);
      setName("");
      setDescription("");
      setOrder("");
      onClose();
    } catch (err) {
      console.error("Error al crear localidad:", err);
      setError("Error al crear la localidad.");
    } finally {
      setLoading(false);
    }
  };

  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50">
      <div
        className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-y-auto animate-fadeIn text-white"
        onClick={stopPropagation}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 flex items-center justify-between px-6 py-4 border-b border-gray-700">
          <h1 className="text-xl font-bold">Crear nueva localidad</h1>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            ❌
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          <div>
            <label className="block text-sm mb-1 text-gray-300">Nombre</label>
            <input
              type="text"
              required
              placeholder="Ej. General, VIP..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-300">
              Descripción (opcional)
            </label>
            <input
              type="text"
              placeholder="Ubicación, características, etc."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-300">Orden</label>
            <input
              type="number"
              required
              placeholder="1"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="isActive"
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="rounded border-gray-600 bg-gray-700 text-emerald-500"
            />
            <label htmlFor="isActive" className="text-sm text-gray-300">
              ¿Está activa?
            </label>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}
          {success && (
            <p className="text-green-400 text-sm">Localidad creada ✅</p>
          )}

          <div className="flex justify-end gap-4 pt-4">
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
              className="px-4 py-2 rounded bg-pink-500 text-white font-semibold hover:bg-pink-600 disabled:opacity-50 text-sm"
            >
              {loading ? "Creando..." : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LocalityModal;
