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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 text-white p-6 rounded-xl shadow-lg w-full max-w-md space-y-4"
      >
        <h2 className="text-xl font-bold">Crear nuevo evento</h2>
        <input
          type="text"
          placeholder="Nombre del evento"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full p-3 rounded bg-gray-800 border border-gray-700"
        />
        <input
          type="text"
          placeholder="Ubicación"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
          className="w-full p-3 rounded bg-gray-800 border border-gray-700"
        />
        <input
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="w-full p-3 rounded bg-gray-800 border border-gray-700"
        />
        <div className="flex justify-between items-center pt-4">
          <button
            type="submit"
            className="bg-amber-400 text-black font-semibold py-2 px-4 rounded hover:scale-105 transition"
          >
            Crear evento
          </button>
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-gray-400 hover:text-red-400"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
