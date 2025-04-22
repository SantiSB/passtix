"use client";

import React from "react";

interface Props {
  onCreateEvent: () => void;
  onCreatePhase: () => void;
  onCreatePromoter: () => void;
  onRegisterTicket: () => void;
}

const DashboardActions: React.FC<Props> = ({
  onCreateEvent,
  onCreatePhase,
  onCreatePromoter,
  onRegisterTicket,
}) => {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <button
        onClick={onCreateEvent}
        className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition transform hover:scale-105 hover:bg-emerald-600"
      >
        Crear evento
      </button>

      <button
        onClick={onCreatePhase}
        className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
      >
        Crear Fase
      </button>

      <button
        onClick={onCreatePromoter}
        className="bg-purple-600 text-white px-4 py-2 rounded shadow hover:bg-purple-700 transition"
      >
        Crear Promotor
      </button>

      <button
        onClick={onRegisterTicket}
        className="inline-flex items-center gap-2 rounded-2xl bg-amber-400 px-6 py-3 text-sm font-semibold text-black shadow-lg transition transform hover:scale-105 hover:bg-amber-500"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4v16m8-8H4"
          />
        </svg>
        Registrar asistente
      </button>
    </div>
  );
};

export default DashboardActions;
