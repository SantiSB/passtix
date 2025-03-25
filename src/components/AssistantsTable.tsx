import React from 'react';
import { Assistant } from '../types/Assistant';

interface AssistantsTableProps {
  assistants: Assistant[];
}

const AssistantsTable: React.FC<AssistantsTableProps> = ({ assistants }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Cell Phone</th>
            <th className="py-2 px-4 border-b">Ticket Type</th>
            <th className="py-2 px-4 border-b">Status</th>
          </tr>
        </thead>
        <tbody>
          {assistants.map((assistant) => (
            <tr key={assistant.id}>
              <td className="py-2 px-4 border-b">{assistant.id}</td>
              <td className="py-2 px-4 border-b">{assistant.name}</td>
              <td className="py-2 px-4 border-b">{assistant.email}</td>
              <td className="py-2 px-4 border-b">{assistant.cellPhone}</td>
              <td className="py-2 px-4 border-b">{assistant.ticketType}</td>
              <td className="py-2 px-4 border-b">{assistant.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssistantsTable;
