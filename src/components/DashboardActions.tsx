"use client";

import React from "react";

interface Props {
  onCreateEvent: () => void;
  onCreatePhase: () => void;
  onCreatePromoter: () => void;
  onCreateLocality: () => void;
  onCreateTicketType: () => void;
  onRegisterTicket: () => void;
  isEventSelected: boolean;
}

const buttonBaseStyle =
  "px-4 py-2 rounded-lg text-sm font-semibold shadow-md transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900";

const DashboardActions: React.FC<Props> = ({
  onCreateEvent,
  onCreatePhase,
  onCreatePromoter,
  onCreateLocality,
  onCreateTicketType,
  onRegisterTicket,
  isEventSelected,
}) => {
  return (
    <div className="flex flex-wrap gap-3 mb-8">
      <button
        onClick={onCreateEvent}
        className={`${buttonBaseStyle} bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500`}
      >
        ✨ Crear Evento
      </button>

      <button
        onClick={onCreatePhase}
        disabled={!isEventSelected}
        title={!isEventSelected ? "Selecciona un evento primero" : ""}
        className={`${buttonBaseStyle} bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 ${
          !isEventSelected ? "opacity-40 cursor-not-allowed" : ""
        }`}
      >
        ➕ Crear Fase
      </button>

      <button
        onClick={onCreatePromoter}
        disabled={!isEventSelected}
        title={!isEventSelected ? "Selecciona un evento primero" : ""}
        className={`${buttonBaseStyle} bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500 ${
          !isEventSelected ? "opacity-40 cursor-not-allowed" : ""
        }`}
      >
        👤 Crear Promotor
      </button>

      <button
        onClick={onCreateLocality}
        disabled={!isEventSelected}
        title={!isEventSelected ? "Selecciona un evento primero" : ""}
        className={`${buttonBaseStyle} bg-pink-500 text-white hover:bg-pink-600 focus:ring-pink-400 ${
          !isEventSelected ? "opacity-40 cursor-not-allowed" : ""
        }`}
      >
        🧭 Crear Localidad
      </button>

      <button
        onClick={onCreateTicketType}
        disabled={!isEventSelected}
        title={!isEventSelected ? "Selecciona un evento primero" : ""}
        className={`${buttonBaseStyle} bg-cyan-600 text-white hover:bg-cyan-700 focus:ring-cyan-500 ${
          !isEventSelected ? "opacity-40 cursor-not-allowed" : ""
        }`}
      >
        🏷️ Crear Tipo de Ticket
      </button>

      <button
        onClick={onRegisterTicket}
        disabled={!isEventSelected}
        title={!isEventSelected ? "Selecciona un evento primero" : ""}
        className={`${buttonBaseStyle} bg-amber-500 text-black hover:bg-amber-600 focus:ring-amber-400 ${
          !isEventSelected ? "opacity-40 cursor-not-allowed" : ""
        }`}
      >
        🎟️ Registrar Asistente
      </button>
    </div>
  );
};

export default DashboardActions;
