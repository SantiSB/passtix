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
      setError("Error al crear la fase.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-xl max-w-md w-full shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-center">Crear nueva fase</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Nombre</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Ej. Preventa 1"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Descripción
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ej. Primera etapa de ventas"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-1">Precio</label>
              <input
                type="text"
                className="w-full p-2 border rounded text-right"
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
              <label className="block text-sm font-semibold mb-1">Orden</label>
              <input
                type="text"
                className="w-full p-2 border rounded text-right"
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
            />
            <label htmlFor="isActive" className="text-sm font-medium">
              ¿Está activa?
            </label>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Fecha y hora de inicio
            </label>
            <input
              type="datetime-local"
              className="w-full p-2 border rounded"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Fecha y hora de cierre
            </label>
            <input
              type="datetime-local"
              className="w-full p-2 border rounded"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Hora máxima de ingreso (opcional)
            </label>
            <input
              type="datetime-local"
              className="w-full p-2 border rounded"
              value={maxEntryTime}
              onChange={(e) => setMaxEntryTime(e.target.value)}
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm">Fase creada ✅</p>}

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
              {loading ? "Creando..." : "Crear fase"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PhaseModal;
