"use client";

import { useState } from "react";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";

interface Props {
  eventId: string;
  isOpen: boolean;
  onClose: () => void;
}

const PhaseModal: React.FC<Props> = ({ eventId, isOpen, onClose }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priceInput, setPriceInput] = useState("");
  const [orderInput, setOrderInput] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [maxEntryTime, setMaxEntryTime] = useState<string>(""); // ⏰ nuevo
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const formatter = new Intl.NumberFormat("es-CO");

  const parseNumber = (input: string) =>
    Number(input.replace(/\./g, "").replace(/,/g, ""));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await addDoc(collection(db, "phase"), {
        name,
        description,
        price: parseNumber(priceInput),
        order: parseNumber(orderInput),
        isActive,
        eventId,
        startDate: Timestamp.fromDate(new Date(startDate)),
        endDate: Timestamp.fromDate(new Date(endDate)),
        maxEntryTime: maxEntryTime
          ? Timestamp.fromDate(new Date(maxEntryTime))
          : null,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      setSuccess(true);
      setName("");
      setDescription("");
      setPriceInput("");
      setOrderInput("");
      setStartDate("");
      setEndDate("");
      setMaxEntryTime("");
      onClose();
    } catch (err) {
      console.error("Error al crear la fase:", err);
      setError("Error al crear la fase.");
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
          <h1 className="text-xl font-bold text-white">Crear nueva fase</h1>
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
            <label className="block text-sm font-semibold mb-1 text-gray-300">Nombre</label>
            <input
              type="text"
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white focus:border-emerald-500 focus:ring-emerald-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Ej. Preventa 1"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-300">
              Descripción
            </label>
            <input
              type="text"
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white focus:border-emerald-500 focus:ring-emerald-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ej. Primera etapa de ventas"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-1 text-gray-300">Precio</label>
              <input
                type="text"
                className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white focus:border-emerald-500 focus:ring-emerald-500 text-right"
                value={priceInput}
                onChange={(e) => {
                  const raw = e.target.value.replace(/\D/g, "");
                  setPriceInput(formatter.format(Number(raw)));
                }}
                placeholder="$40.000"
                required
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-semibold mb-1 text-gray-300">Orden</label>
              <input
                type="text"
                className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white focus:border-emerald-500 focus:ring-emerald-500 text-right"
                value={orderInput}
                onChange={(e) => {
                  const raw = e.target.value.replace(/\D/g, "");
                  setOrderInput(formatter.format(Number(raw)));
                }}
                placeholder="1"
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              id="isActive"
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="rounded border-gray-600 bg-gray-700 text-emerald-500 focus:ring-emerald-500"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-300">
              ¿Está activa?
            </label>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-300">
              Fecha y hora de inicio
            </label>
            <input
              type="datetime-local"
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white focus:border-emerald-500 focus:ring-emerald-500 calendar-dark"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-300">
              Fecha y hora de cierre
            </label>
            <input
              type="datetime-local"
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white focus:border-emerald-500 focus:ring-emerald-500 calendar-dark"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-300">
              Hora máxima de ingreso (opcional)
            </label>
            <input
              type="datetime-local"
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white focus:border-emerald-500 focus:ring-emerald-500 calendar-dark"
              value={maxEntryTime}
              onChange={(e) => setMaxEntryTime(e.target.value)}
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}
          {success && <p className="text-green-400 text-sm">Fase creada ✅</p>}

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
              {loading ? "Creando..." : "Crear fase"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PhaseModal;
