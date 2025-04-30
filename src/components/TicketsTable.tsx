/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import useFilteredTickets from "@/hooks/useFilteredTickets";
import TicketModal from "./TicketModal";
import useTicketInputs from "@/hooks/useTicketInputs";
import useTicketModal from "@/hooks/useTicketModal";
import useDeleteTicket from "@/hooks/useDeleteTicket";
import { getStatusBadgeClass } from "@/lib/utils/ticket";
import { Timestamp } from "firebase/firestore";
import { SortKey } from "@/hooks/useTicketSort";

interface TicketsTableProps {
  eventId: string;
}

const TicketsTable: React.FC<TicketsTableProps> = ({ eventId }) => {
  const {
    nameInput,
    setNameInput,
    idInput,
    setIdInput,
    ticketIdInput,
    setTicketIdInput,
    debouncedName,
    debouncedId,
    debouncedTicketId,
  } = useTicketInputs();

  const {
    tickets,
    isLoading,
    isFetching,
    isError,
    usingPagination,
    pagination,
    sortKey,
    sortDirection,
    setSort,
  } = useFilteredTickets(eventId, {
    name: debouncedName,
    idNumber: debouncedId,
    ticketId: debouncedTicketId,
  });

  const {
    isModalOpen,
    modalMode,
    selectedTicket,
    openEditModal,
    openDeleteModal,
    closeModal,
  } = useTicketModal();

  const {
    deleteTicket,
    loading: loadingDelete,
    error,
  } = useDeleteTicket(closeModal);

  const errorDelete = error;

  if (isLoading) return <p className="p-4 text-gray-500">Cargando tickets…</p>;
  if (isError)
    return <p className="p-4 text-red-500">Error al cargar los tickets.</p>;

  const SortableHeader = (label: string, key: SortKey) => (
    <th
      onClick={() => setSort(key)}
      className="cursor-pointer px-4 py-3 font-semibold whitespace-nowrap select-none"
    >
      {label} {sortKey === key && (sortDirection === "asc" ? "↑" : "↓")}
    </th>
  );

  return (
    <div className="rounded-xl border border-gray-200 shadow-sm bg-white">
      {/* filtros */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-end px-4 py-3">
        <input
          type="text"
          placeholder="Buscar por nombre…"
          className="border border-gray-300 px-3 py-2 rounded-md text-sm w-full"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
        />
        <input
          type="text"
          placeholder="Buscar por cédula…"
          className="border border-gray-300 px-3 py-2 rounded-md text-sm w-full"
          value={idInput}
          onChange={(e) => setIdInput(e.target.value)}
        />
        <input
          type="text"
          placeholder="Buscar por ID de boleta…"
          className="border border-gray-300 px-3 py-2 rounded-md text-sm w-full"
          value={ticketIdInput}
          onChange={(e) => setTicketIdInput(e.target.value)}
        />
      </div>

      {isFetching && (
        <p className="px-4 text-sm text-gray-500 animate-pulse">
          🔎 Buscando resultados…
        </p>
      )}

      {/* tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="text-xs uppercase bg-black/90 text-white">
            <tr>
              <th className="px-4 py-3 font-semibold whitespace-nowrap">#</th>
              <th className="px-4 py-3 font-semibold whitespace-nowrap">ID</th>
              {SortableHeader("Estado", "status")}
              {SortableHeader("Nombre", "name")}
              <th className="px-4 py-3 font-semibold whitespace-nowrap">
                Tipo Doc
              </th>
              <th className="px-4 py-3 font-semibold whitespace-nowrap">
                Documento
              </th>
              {SortableHeader("Tipo", "ticketType")}
              {SortableHeader("Precio", "price")}
              {SortableHeader("Fase", "phaseName")}
              {SortableHeader("Localidad", "localityName")}
              {SortableHeader("Promotor", "promoterName")}
              <th className="px-4 py-3 font-semibold whitespace-nowrap">
                Correo
              </th>
              <th className="px-4 py-3 font-semibold whitespace-nowrap">
                Celular
              </th>
              {SortableHeader("Creado", "createdAt")}
              {SortableHeader("Actualizado", "updatedAt")}
              {SortableHeader("Ingreso", "checkedInAt")}
              <th className="px-4 py-3 font-semibold whitespace-nowrap">
                URL QR
              </th>
              <th className="px-4 py-3 font-semibold whitespace-nowrap">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((t, i) => (
              <tr key={t.id} className="even:bg-gray-50 hover:bg-gray-100">
                <td className="px-4 py-3">{i + 1}</td>
                <td className="px-4 py-3">{t.id}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClass(
                      t.status
                    )}`}
                  >
                    {t.status === "enabled"
                      ? "Habilitado"
                      : t.status === "joined"
                        ? "Ingresado"
                        : t.status}
                  </span>
                </td>
                <td className="px-4 py-3 font-medium">{t.name}</td>
                <td className="px-4 py-3">{t.identificationType}</td>
                <td className="px-4 py-3">{t.identificationNumber}</td>
                <td className="px-4 py-3">
                  {t.ticketType === "courtesy"
                    ? "Cortesía"
                    : t.ticketType === "brunch"
                      ? "Brunch"
                      : "Boleta"}
                </td>
                <td className="px-4 py-3">{t.price ? `$${t.price}` : "—"}</td>
                <td className="px-4 py-3">{t.phaseName}</td>
                <td className="px-4 py-3">{t.localityName}</td>
                <td className="px-4 py-3">{t.promoterName ?? "—"}</td>
                <td className="px-4 py-3">{t.email}</td>
                <td className="px-4 py-3">{t.phoneNumber}</td>
                <td className="px-4 py-3">
                  {t.createdAt instanceof Date
                    ? t.createdAt.toLocaleString()
                    : "—"}
                </td>
                <td className="px-4 py-3">
                  {t.updatedAt instanceof Date
                    ? t.updatedAt.toLocaleString()
                    : "—"}
                </td>
                <td className="px-4 py-3">
                  {t.checkedInAt
                    ? t.checkedInAt instanceof Timestamp
                      ? t.checkedInAt.toDate().toLocaleString()
                      : t.checkedInAt instanceof Date
                        ? t.checkedInAt.toLocaleString()
                        : "—"
                    : "—"}
                </td>
                <td className="px-4 py-3">
                  <a
                    href={t.qrCode}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline break-all"
                  >
                    Ver QR
                  </a>
                </td>
                <td className="px-4 py-3 flex space-x-2">
                  <button
                    onClick={() => openEditModal(t)}
                    className="px-2 py-1 bg-black/80 text-white rounded-lg text-xs"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => openDeleteModal(t)}
                    className="px-2 py-1 bg-red-600 text-white rounded-lg text-xs"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* paginación (desactivada temporalmente para ordenamiento global) */}
      {/*
      {usingPagination && pagination && (
        <div className="flex justify-between items-center p-4">
          <button
            onClick={pagination.prevPage}
            disabled={!pagination.canGoBack || isFetching}
            className="px-3 py-2 bg-amber-400 rounded-lg shadow disabled:opacity-50"
          >
            ← Anterior
          </button>
          <span className="text-sm text-gray-600">
            Página <strong>{pagination.pageIndex}</strong>
          </span>
          <button
            onClick={pagination.nextPage}
            disabled={!pagination.hasMore || isFetching}
            className="px-3 py-2 bg-amber-400 rounded-lg shadow disabled:opacity-50"
          >
            Siguiente →
          </button>
        </div>
      )}
      */}

      {selectedTicket && modalMode && (
        <TicketModal
          isOpen={isModalOpen}
          onClose={closeModal}
          mode={modalMode}
          ticket={selectedTicket}
          eventId={eventId}
          onConfirmDelete={() => deleteTicket(selectedTicket.id)}
          loadingDelete={loadingDelete}
          errorDelete={errorDelete}
        />
      )}
    </div>
  );
};

export default TicketsTable;
