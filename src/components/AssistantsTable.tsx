import React from 'react';
import { Assistant } from '../types/Assistant';

interface AssistantsTableProps {
  assistants: Assistant[];
}

const getStatusBadgeClass = (status: string) => {
  switch (status.toLowerCase()) {
    case 'joined':
      return 'bg-green-500 text-white';
    case 'enabled':
      return 'bg-blue-500 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
};

const AssistantsTable: React.FC<AssistantsTableProps> = ({ assistants }) => {
  return (
    <div className="overflow-x-auto bg-white text-black">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-emerald-800 text-white font-bold">
            <th className="py-3 px-4 border-b">#</th>
            <th className="py-3 px-4 border-b">Nombre</th>
            <th className="py-3 px-4 border-b">Cédula</th>
            <th className="py-3 px-4 border-b">Correo Electrónico</th>
            <th className="py-3 px-4 border-b">Teléfono Celular</th>
            <th className="py-3 px-4 border-b">Tipo de Ticket</th>
            <th className="py-3 px-4 border-b">Estado</th>
          </tr>
        </thead>
        <tbody>
          {assistants.map((assistant, index) => (
            <tr key={assistant.id} className="hover:bg-gray-100">
              <td className="py-3 px-4 border-b">{index + 1}</td>
              <td className="py-3 px-4 border-b">{assistant.identificationCard}</td>
              <td className="py-3 px-4 border-b">{assistant.name}</td>
              <td className="py-3 px-4 border-b">{assistant.email}</td>
              <td className="py-3 px-4 border-b">{assistant.cellPhone}</td>
              <td className="py-3 px-4 border-b">{assistant.ticketType}</td>
              <td className={`py-3 px-4 border-b ${getStatusBadgeClass(assistant.status)}`}>{assistant.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssistantsTable;
