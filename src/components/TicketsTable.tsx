import usePaginatedTickets from "@/hooks/usePaginatedTickets";
import { EnrichedTicket } from "@/interfaces/EnrichedTicket";
import { useState } from "react";
import { Timestamp } from "firebase/firestore";
import TicketModal from "./TicketModal";

const getStatusBadgeClass = (status: string) => {
  switch (status.toLowerCase()) {
    case "enabled":
      return "bg-blue-800 text-white";
    case "joined":
      return "bg-green-800 text-white";
    default:
      return "bg-gray-300 text-gray-700";
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
    refetch, // necesario para recargar luego de borrar
  } = usePaginatedTickets();

  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<EnrichedTicket | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openEditModal = (ticket: EnrichedTicket) => {
    setSelectedTicket(ticket);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setSelectedTicket(null);
  };

  /** DELETE vía body JSON */
  const handleDelete = async (ticketId: string) => {
    if (!confirm("¿Eliminar definitivamente este ticket?")) return;

    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      const res = await fetch("/api/delete-ticket", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: ticketId }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Error eliminando ticket");
      }

      setSuccess(true);
      refetch?.();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error desconocido";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading)
    return <p className="p-4 text-gray-500">Cargando tickets...</p>;
  if (isError)
    return <p className="p-4 text-red-500">Error al cargar los tickets.</p>;

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm bg-white">
      <table className="min-w-full text-sm text-left text-gray-700">
        <thead className="text-xs uppercase bg-black/90 text-white">
          <tr>
            {[
              "#",
              "Estado",
              "Nombre",
              "Cédula",
              "Tipo",
              "Precio",
              "Fase",
              "Localidad",
              "Promotor",
              "Correo",
              "Celular",
              "Ingreso",
              "Acciones",
            ].map((header) => (
              <th
                key={header}
                className="px-4 py-3 font-semibold tracking-wide"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket, index) => (
            <tr key={ticket.id} className="even:bg-gray-50 hover:bg-gray-100">
              <td className="px-4 py-3">{index + 1}</td>
              <td className="px-4 py-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClass(
                    ticket.status
                  )}`}
                >
                  {ticket.status === "enabled"
                    ? "Habilitado"
                    : ticket.status === "joined"
                      ? "Ingresado"
                      : ticket.status}
                </span>
              </td>
              <td className="px-4 py-3 font-medium text-gray-900">
                {ticket.name}
              </td>
              <td className="px-4 py-3">{ticket.identificationNumber}</td>
              <td className="px-4 py-3">{ticket.ticketType}</td>
              <td className="px-4 py-3">
                {ticket.price ? `$${ticket.price}` : "—"}
              </td>
              <td className="px-4 py-3">{ticket.phaseName}</td>
              <td className="px-4 py-3">{ticket.localityName}</td>
              <td className="px-4 py-3">{ticket.promoterName ?? "—"}</td>
              <td className="px-4 py-3">{ticket.email}</td>
              <td className="px-4 py-3">{ticket.phoneNumber}</td>
              <td className="px-4 py-3">
                {ticket.checkedInAt
                  ? ticket.checkedInAt instanceof Timestamp
                    ? ticket.checkedInAt.toDate().toLocaleString()
                    : ticket.checkedInAt instanceof Date
                      ? ticket.checkedInAt.toLocaleString()
                      : "—"
                  : "—"}
              </td>
              <td className="px-4 py-3 flex space-x-2">
                <button
                  onClick={() => openEditModal(ticket)}
                  className="px-2 py-1 bg-black/80 text-white rounded-lg text-xs transition transform hover:scale-105"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(ticket.id)}
                  className="px-2 py-1 bg-red-600 text-white rounded-lg text-xs transition transform hover:scale-105"
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center p-4">
        <button
          onClick={prevPage}
          disabled={!canGoBack || isFetching}
          className="px-3 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ← Anterior
        </button>

        <span className="text-sm text-gray-600">
          Página <strong>{pageIndex}</strong>
        </span>

        <button
          onClick={nextPage}
          disabled={!hasMore || isFetching}
          className="px-3 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Siguiente →
        </button>
      </div>

      {selectedTicket && (
        <TicketModal
          mode="edit"
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          ticket={selectedTicket}
        />
      )}

      <style jsx>{`
        @media (max-width: 640px) {
          td.px-4.py-3.flex.space-x-2 {
            flex-direction: column;
            align-items: center;
          }
          button {
            width: 100%;
            margin-bottom: 4px;
          }
        }
      `}</style>
    </div>
  );
};

export default TicketsTable;
