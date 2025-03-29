import React, { useState, useEffect } from 'react';
import { Assistant } from '@/interfaces/Assistant';
import { Ticket } from '@/interfaces/Ticket';
import useTicketsByAssistant from '@/hooks/useTicketsByAssistant';

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
  const [ticketsMap, setTicketsMap] = useState<Record<string, Ticket | null>>({});

  // Aquí llamamos directamente al hook useTicketsByAssistant
  useEffect(() => {
    const fetchTickets = async () => {
      const result: Record<string, Ticket | null> = {};
      for (const assistant of assistants) {
        const { tickets } = await useTicketsByAssistant(assistant.id); // Llamada al hook aquí
        result[assistant.id] = tickets[0] ?? null; // MVP: solo un ticket por asistente
      }
      setTicketsMap(result);
    };

    if (assistants.length > 0) {
      fetchTickets(); // Cargamos los tickets al principio
    }
  }, [assistants]);

  return (
    <div className="overflow-x-auto bg-white text-black">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-emerald-800 text-white font-bold">
            <th className="py-3 px-4 border-b">#</th>
            <th className="py-3 px-4 border-b">Nombre</th>
            <th className="py-3 px-4 border-b">Documento</th>
            <th className="py-3 px-4 border-b">Correo</th>
            <th className="py-3 px-4 border-b">Teléfono</th>
            <th className="py-3 px-4 border-b">Tipo Ticket</th>
            <th className="py-3 px-4 border-b">Estado</th>
          </tr>
        </thead>
        <tbody>
          {assistants.map((assistant, index) => {
            const ticket = ticketsMap[assistant.id];

            return (
              <tr key={assistant.id} className="hover:bg-gray-100">
                <td className="py-3 px-4 border-b">{index + 1}</td>
                <td className="py-3 px-4 border-b">{assistant.name}</td>
                <td className="py-3 px-4 border-b">{assistant.identificationNumber}</td>
                <td className="py-3 px-4 border-b">{assistant.email}</td>
                <td className="py-3 px-4 border-b">{assistant.cellPhone}</td>
                <td className="py-3 px-4 border-b">
                  {ticket ? ticket.ticketType : '—'}
                </td>
                <td className={`py-3 px-4 border-b ${getStatusBadgeClass(ticket?.status || '')}`}>
                  {ticket ? ticket.status : '—'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AssistantsTable;
