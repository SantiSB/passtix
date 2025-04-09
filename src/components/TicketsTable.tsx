import usePaginatedTickets, { PAGE_SIZE } from "@/hooks/usePaginatedTickets";
import { EnrichedTicket } from "@/interfaces/EnrichedTicket";
import { useState, useEffect } from "react";
import { Timestamp } from "firebase/firestore";
import TicketModal from "./TicketModal";
import { useDebounce } from "use-debounce";

/* Helpers */
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
    refetch,
    searchTerm,
    updateSearchTerm,
  } = usePaginatedTickets();

  const [isModalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"edit" | "delete" | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<EnrichedTicket | null>(
    null
  );

  const [loadingDelete, setLoadingDelete] = useState(false);
  const [errorDelete, setErrorDelete] = useState<string | null>(null);

  const [inputValue, setInputValue] = useState(searchTerm);
  const [debouncedValue] = useDebounce(inputValue, 400); // 400ms

  useEffect(() => {
    updateSearchTerm(debouncedValue);
  }, [debouncedValue]);

  const openEditModal = (ticket: EnrichedTicket) => {
    setSelectedTicket(ticket);
    setModalMode("edit");
    setModalOpen(true);
  };

  const openDeleteModal = (ticket: EnrichedTicket) => {
    setSelectedTicket(ticket);
    setModalMode("delete");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedTicket(null);
    setModalMode(null);
    setErrorDelete(null);
  };

  const handleDelete = async (ticketId: string) => {
    setLoadingDelete(true);
    setErrorDelete(null);

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

      await refetch?.();
      closeModal();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error desconocido";
      setErrorDelete(msg);
    } finally {
      setLoadingDelete(false);
    }
  };

  if (isLoading)
    return <p className="p-4 text-gray-500">Cargando tickets...</p>;
  if (isError)
    return <p className="p-4 text-red-500">Error al cargar los tickets.</p>;

  return (
    <div className="rounded-xl border border-gray-200 shadow-sm bg-white">
      {/* 🔍 Filtro por nombre */}
      <div className="flex justify-end px-4 py-3">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          className="border border-gray-300 px-3 py-2 rounded-md text-sm w-full max-w-xs"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </div>

      {isFetching && searchTerm && (
        <p className="px-4 text-sm text-gray-500 animate-pulse">
          🔎 Buscando resultados...
        </p>
      )}

      {/* Tabla */}
      <div className="overflow-x-auto">
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
                  className="px-4 py-3 font-semibold tracking-wide whitespace-nowrap"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {tickets.map((ticket: EnrichedTicket, index: number) => (
              <tr key={ticket.id} className="even:bg-gray-50 hover:bg-gray-100">
                <td className="px-4 py-3">
                  {searchTerm
                    ? index + 1
                    : (pageIndex - 1) * PAGE_SIZE + index + 1}
                </td>

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
                <td className="px-4 py-3">
                  {ticket.ticketType === "courtesy"
                    ? "Cortesia"
                    : ticket.ticketType === "ticket"
                      ? "Boleta"
                      : ticket.ticketType}
                </td>
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
                    onClick={() => openDeleteModal(ticket)}
                    className="px-2 py-1 bg-red-600 text-white rounded-lg text-xs transition transform hover:scale-105"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación solo si NO estamos buscando */}
      {!searchTerm && (
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
      )}

      {/* Modal */}
      {selectedTicket && modalMode && (
        <TicketModal
          isOpen={isModalOpen}
          onClose={closeModal}
          mode={modalMode}
          ticket={selectedTicket}
          onConfirmDelete={() => handleDelete(selectedTicket.id)}
          loadingDelete={loadingDelete}
          errorDelete={errorDelete}
        />
      )}
    </div>
  );
};

export default TicketsTable;
