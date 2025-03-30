'use client';

import TicketsTable from '@/components/TicketsTable';
import CreateAssistantModal from '@/components/RegisterTicketModal';
import useTickets from '@/hooks/useTickets';
import { useState } from 'react';

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { tickets, loading, error } = useTickets();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-black shadow-md">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold text-white">Dashboard</h1>
          <button
            onClick={openModal}
            className="mt-4 bg-emerald-800 text-white px-5 py-3 rounded-lg shadow-lg transition duration-300 ease-in-out hover:bg-emerald-700"
          >
            Registrar nuevo asistente
          </button>
        </div>
      </header>

      <main>
        <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
          <div className="px-4 py-8 sm:px-0">
            <div className="border-2 border-emerald-800 rounded-lg shadow-inner overflow-auto">
              {loading ? (
                <p className="p-4 text-center">Cargando tickets...</p>
              ) : error ? (
                <p className="p-4 text-center text-red-500">{error}</p>
              ) : (
                <TicketsTable tickets={tickets} />
              )}
            </div>
          </div>
        </div>
      </main>

      <CreateAssistantModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default Dashboard;
