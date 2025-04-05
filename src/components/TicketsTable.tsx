import usePaginatedTickets from "@/hooks/usePaginatedTickets";
import { EnrichedTicket } from "@/interfaces/EnrichedTicket";
import { useState } from "react";
import EditTicketModal from "./EditTicketModal";
import { Timestamp } from "firebase/firestore";

const getStatusBadgeClass = (status: string) => {
  switch (status.toLowerCase()) {
    case "enabled":
      return "bg-blue-500 text-white";
    case "joined":
      return "bg-green-500 text-white";
    case "pending":
      return "bg-yellow-500 text-white";
    case "failed":
      return "bg-red-500 text-white";
    default:
      return "bg-gray-500 text-white";
  }
};

const TicketsTable: React.FC = () => {
  const {
    tickets,
    isLoading,
    isFetching,
    isError,
    hasMore,
    nextPage,
    prevPage,
    canGoBack,
    pageIndex,
  } = usePaginatedTickets();

  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<EnrichedTicket | null>(
    null
  );

  const openEditModal = (ticket: EnrichedTicket) => {
    setSelectedTicket(ticket);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setSelectedTicket(null);
  };

  const handleEdit = (ticket: EnrichedTicket) => {
    openEditModal(ticket);
  };

  if (isLoading)
    return <p className="p-4 text-gray-500">Cargando tickets...</p>;
  if (isError)
    return <p className="p-4 text-red-500">Error al cargar los tickets.</p>;

  return (
    <div className="overflow-x-auto bg-white text-black">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-emerald-800 text-white font-bold">
            <th className="py-3 px-4 border-b">🎫​</th>
            <th className="py-3 px-4 border-b">Estado</th>
            <th className="py-3 px-4 border-b">Nombre</th>
            <th className="py-3 px-4 border-b">Cedula</th>
            <th className="py-3 px-4 border-b">Tipo</th>
            <th className="py-3 px-4 border-b">Precio</th>
            <th className="py-3 px-4 border-b">Fase</th>
            <th className="py-3 px-4 border-b">Localidad</th>
            <th className="py-3 px-4 border-b">Promotor</th>
            <th className="py-3 px-4 border-b">Correo</th>
            <th className="py-3 px-4 border-b">Celular</th>
            <th className="py-3 px-4 border-b">Ingreso</th>
            <th className="py-3 px-4 border-b">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket, index) => (
            <TicketRow
              key={ticket.id}
              ticket={ticket}
              index={index}
              handleEdit={handleEdit}
            />
          ))}
        </tbody>
      </table>

      <div className="flex items-center justify-between mt-4 px-4">
        <button
          onClick={prevPage}
          disabled={!canGoBack || isFetching}
          className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
        >
          ← Anterior
        </button>

        <span className="text-sm text-gray-600">
          Página <strong>{pageIndex}</strong>
        </span>

        <button
          onClick={nextPage}
          disabled={!hasMore || isFetching}
          className="bg-emerald-800 text-white px-4 py-2 rounded disabled:opacity-50 hover:bg-emerald-700"
        >
          Siguiente →
        </button>
      </div>

      {selectedTicket && (
        <EditTicketModal
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          ticket={selectedTicket}
        />
      )}
    </div>
  );
};

const TicketRow: React.FC<{
  ticket: EnrichedTicket;
  index: number;
  handleEdit: (ticket: EnrichedTicket) => void;
}> = ({ ticket, index, handleEdit }) => (
  <tr key={ticket.id} className="hover:bg-gray-100">
    <td className="py-3 px-4 border-b">{index + 1}</td>
    <td className={`py-3 px-4 border-b ${getStatusBadgeClass(ticket.status)}`}>
      {ticket.status}
    </td>
    <td className="py-3 px-4 border-b">{ticket.name}</td>
    <td className="py-3 px-4 border-b">{ticket.identificationNumber}</td>
    <td className="py-3 px-4 border-b">{ticket.ticketType}</td>
    <td className="py-3 px-4 border-b">
      {ticket.price ? `$${ticket.price}` : "—"}
    </td>
    <td className="py-3 px-4 border-b">{ticket.phaseName}</td>
    <td className="py-3 px-4 border-b">{ticket.localityName}</td>
    <td className="py-3 px-4 border-b">{ticket.promoterName ?? "—"}</td>

    <td className="py-3 px-4 border-b">{ticket.email}</td>
    <td className="py-3 px-4 border-b">{ticket.phoneNumber}</td>
    
    <td className="py-3 px-4 border-b">
      {ticket.checkedInAt
        ? ticket.checkedInAt instanceof Timestamp
          ? ticket.checkedInAt.toDate().toLocaleString()
          : ticket.checkedInAt instanceof Date
            ? ticket.checkedInAt.toLocaleString()
            : "—"
        : "—"}
    </td>

    <td className="py-3 px-4 border-b">
      <button
        onClick={() => handleEdit(ticket)}
        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
      >
        Edit
      </button>
    </td>
  </tr>
);

export default TicketsTable;
