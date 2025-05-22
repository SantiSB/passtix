"use client";

import { useState } from "react";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";

interface Props {
  eventId: string;
  isOpen: boolean;
  onClose: () => void;
}

const TicketTypeModal: React.FC<Props> = ({ eventId, isOpen, onClose }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priceInput, setPriceInput] = useState(""); // 💰 nuevo
  const [maxEntryTime, setMaxEntryTime] = useState(""); // ⏰ nuevo
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatter = new Intl.NumberFormat("es-CO");

  const parseNumber = (input: string) =>
    Number(input.replace(/\./g, "").replace(/,/g, ""));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await addDoc(collection(db, "ticketTypes"), {
        name,
        description,
        price: priceInput ? parseNumber(priceInput) : 0,
        maxEntryTime: maxEntryTime
          ? Timestamp.fromDate(new Date(maxEntryTime))
          : null,
        eventId,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      setSuccess(true);
      setName("");
      setDescription("");
      setPriceInput("");
      setMaxEntryTime("");
      onClose();
    } catch (err) {
      console.error("Error al crear el tipo de ticket:", err);
      setError("No se pudo crear el tipo de ticket.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50">
      <div className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-md mx-4 p-6 text-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Nuevo Tipo de Ticket</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            ❌
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-semibold block mb-1">Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded bg-gray-800 border border-gray-700 p-2 text-white focus:ring-cyan-500"
              required
              placeholder="Ej. Boleta, Cortesia..."
            />
          </div>

          <div>
            <label className="text-sm font-semibold block mb-1">
              Descripción
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded bg-gray-800 border border-gray-700 p-2 text-white focus:ring-cyan-500"
              placeholder="Ej. Ingreso sin costo"
            />
          </div>

          <div>
            <label className="text-sm font-semibold block mb-1">
              Precio (opcional)
            </label>
            <input
              type="text"
              value={priceInput}
              onChange={(e) => {
                const raw = e.target.value.replace(/\D/g, "");
                setPriceInput(formatter.format(Number(raw)));
              }}
              placeholder="$0"
              className="w-full rounded bg-gray-800 border border-gray-700 p-2 text-white focus:ring-cyan-500 text-right"
            />
          </div>

          <div>
            <label className="text-sm font-semibold block mb-1">
              Hora máxima de entrada (opcional)
            </label>
            <input
              type="datetime-local"
              value={maxEntryTime}
              onChange={(e) => setMaxEntryTime(e.target.value)}
              className="w-full rounded bg-gray-800 border border-gray-700 p-2 text-white focus:ring-cyan-500"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}
          {success && (
            <p className="text-green-400 text-sm">Tipo de ticket creado ✅</p>
          )}

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
              className="px-4 py-2 rounded bg-cyan-600 text-white font-semibold hover:bg-cyan-700 disabled:opacity-50 text-sm"
            >
              {loading ? "Creando..." : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TicketTypeModal;
