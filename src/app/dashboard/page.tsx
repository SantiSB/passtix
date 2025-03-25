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
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-200">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold text-gray-800">Dashboard</h1>
          <button onClick={openModal} className="mt-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white px-5 py-3 rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-800 transition duration-300 ease-in-out">
            Registrar nuevo asistente
          </button>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
          <div className="px-4 py-8 sm:px-0">
            <div className="border-4 border-dashed border-gray-300 rounded-lg h-96 shadow-inner">
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
