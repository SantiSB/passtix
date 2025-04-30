"use client";

import React from "react";

interface Props {
  onCreateEvent: () => void;
  onCreatePhase: () => void;
  onCreatePromoter: () => void;
  onRegisterTicket: () => void;
}

// Define a base style for buttons
const buttonBaseStyle =
  "px-4 py-2 rounded-lg text-sm font-semibold shadow-md transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900";

const DashboardActions: React.FC<Props> = ({
  onCreateEvent,
  onCreatePhase,
  onCreatePromoter,
  onRegisterTicket,
}) => {
  return (
    <div className="flex flex-wrap gap-3 mb-8"> {/* Reduced gap slightly and increased mb */}
      <button
        onClick={onCreateEvent}
        className={`${buttonBaseStyle} bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500`}
      >
        ✨ Crear Evento
      </button>

      <button
        onClick={onCreatePhase}
        className={`${buttonBaseStyle} bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500`}
      >
        ➕ Crear Fase
      </button>

      <button
        onClick={onCreatePromoter}
        className={`${buttonBaseStyle} bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500`}
      >
        👤 Crear Promotor
      </button>

      <button
        onClick={onRegisterTicket}
        className={`${buttonBaseStyle} bg-amber-500 text-black hover:bg-amber-600 focus:ring-amber-400`}
      >
        🎟️ Registrar Asistente
      </button>
    </div>
  );
};

export default DashboardActions;
