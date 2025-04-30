"use client";

import { useState } from "react";
import { db } from "@/lib/firebase/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function EventModal({ isOpen, onClose }: Props) {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    await addDoc(collection(db, "event"), {
      name,
      location,
      date: new Date(date),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      producerId: user.uid,
    });

    setName("");
    setLocation("");
    setDate("");
    onClose();
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
          <h1 className="text-xl font-bold text-white">Crear nuevo evento</h1>
          <button
            className="text-gray-400 hover:text-white transition"
            onClick={onClose}
          >
            ❌
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-5">
          <input
            type="text"
            placeholder="Nombre del evento"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white focus:border-emerald-500 focus:ring-emerald-500"
          />
          <input
            type="text"
            placeholder="Ubicación"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white focus:border-emerald-500 focus:ring-emerald-500"
          />
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white focus:border-emerald-500 focus:ring-emerald-500 calendar-dark"
          />
          {/* Actions */}
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
              className="px-4 py-2 rounded bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition text-sm"
            >
              Crear evento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
