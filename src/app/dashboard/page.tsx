'use client';
import AssistantsTable from '@/components/AssistantsTable';
import useAssistants from '@/hooks/useAssistants';
import CreateAssistantModal from '@/components/CreateAssistantModal';
import { useState } from 'react';

const Dashboard = () => {
  const assistants = useAssistants();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <button onClick={openModal} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Registrar nuevo asistente
          </button>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg h-96">
              <AssistantsTable assistants={assistants} />
            </div>
          </div>
        </div>
      </main>
      <CreateAssistantModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default Dashboard;
