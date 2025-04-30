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
    // usingPagination,
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

  if (isLoading) return <p className="p-4 text-center text-gray-500">Cargando tickets…</p>;
  if (isError)
    return <p className="p-4 text-center text-red-500">Error al cargar los tickets.</p>;

  const SortableHeader = (label: string, key: SortKey) => (
    <th
      onClick={() => setSort(key)}
      className="cursor-pointer px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors select-none"
    >
      <div className="flex items-center gap-1.5">
        {label}
        {sortKey === key && (
          <span className="text-gray-400">
            {sortDirection === "asc" ? "▲" : "▼"}
          </span>
        )}
      </div>
    </th>
  );

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800 overflow-hidden">
      {/* Filter Section - No Icons */}
      <div className="p-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Buscar por nombre…"
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-3 py-2 rounded-md text-sm w-full focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
          />
          <input
            type="text"
            placeholder="Buscar por cédula…"
             className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-3 py-2 rounded-md text-sm w-full focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
            value={idInput}
            onChange={(e) => setIdInput(e.target.value)}
          />
          <input
            type="text"
            placeholder="Buscar por ID de boleta…"
             className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-3 py-2 rounded-md text-sm w-full focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
            value={ticketIdInput}
            onChange={(e) => setTicketIdInput(e.target.value)}
          />
        </div>
      </div>

      {isFetching && (
        <p className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
          ⏳ Buscando resultados…
        </p>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
           <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">#</th>
              {SortableHeader("Estado", "status")}
              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">ID</th>
              {SortableHeader("Nombre", "name")}
              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">
                Documento
              </th>
              {SortableHeader("Tipo", "ticketType")}
              {SortableHeader("Fase", "phaseName")}
              {SortableHeader("Precio", "price")}
              {SortableHeader("Promotor", "promoterName")}
              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">
                Celular
              </th>
              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">
                Correo
              </th>
              {SortableHeader("Ingreso", "checkedInAt")}
              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">
                URL QR
              </th>
              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">
                Acciones
              </th>
            </tr>
          </thead>
           <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {tickets.map((t, i) => (
               <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                 <td className="px-5 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">{i + 1}</td>
                 <td className="px-5 py-4 whitespace-nowrap">
                   <span
                     className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(
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
                 <td className="px-5 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400 font-mono text-xs">{t.id}</td>
                 <td className="px-5 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-white">{t.name}</td>
                 <td className="px-5 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">{t.identificationNumber}</td>
                 <td className="px-5 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                   {t.ticketType === "courtesy"
                     ? "Cortesía"
                     : t.ticketType === "brunch"
                       ? "Brunch"
                       : "Boleta"}
                 </td>
                 <td className="px-5 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">{t.phaseName}</td>
                 <td className="px-5 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">{t.price ? `$${t.price}` : "—"}</td>
                 <td className="px-5 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">{t.promoterName ?? "—"}</td>
                 <td className="px-5 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">{t.phoneNumber}</td>
                 <td className="px-5 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">{t.email}</td>
                 <td className="px-5 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400 text-xs">
                   {t.checkedInAt
                     ? t.checkedInAt instanceof Timestamp
                       ? t.checkedInAt.toDate().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })
                       : t.checkedInAt instanceof Date
                         ? t.checkedInAt.toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })
                         : "—"
                     : "—"}
                 </td>
                 <td className="px-5 py-4 whitespace-nowrap">
                   <a
                     href={t.qrCode}
                     target="_blank"
                     rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline text-xs"
                   >
                     Ver QR
                   </a>
                 </td>
                 <td className="px-5 py-4 whitespace-nowrap text-right text-sm font-medium">
                   <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => openEditModal(t)}
                       className="p-1.5 rounded text-blue-600 hover:text-blue-800 hover:bg-blue-100 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-gray-700 transition-colors"
                       title="Editar"
                    >
                       ✏️ <span className="sr-only">Editar</span>
                    </button>
                    <button
                      onClick={() => openDeleteModal(t)}
                        className="p-1.5 rounded text-red-600 hover:text-red-800 hover:bg-red-100 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-gray-700 transition-colors"
                        title="Eliminar"
                    >
                       🗑️ <span className="sr-only">Eliminar</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
             {tickets.length === 0 && !isFetching && (
              <tr>
                 <td colSpan={15} className="text-center py-10 text-gray-500 dark:text-gray-400">
                  No se encontraron tickets con los filtros actuales.
                </td>
              </tr>
             )}
          </tbody>
        </table>
      </div>

       {/* {pagination && (
        <div className="flex justify-between items-center p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={pagination.prevPage}
            disabled={!pagination.canGoBack || isFetching}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-md shadow text-sm font-medium disabled:opacity-50 transition-opacity"
          >
            ← Anterior
          </button>
          <span className="text-sm text-gray-600 dark:text-gray-400">
             Página {pagination.pageIndex}
          </span>
          <button
            onClick={pagination.nextPage}
            disabled={!pagination.hasMore || isFetching}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-md shadow text-sm font-medium disabled:opacity-50 transition-opacity"
          >
            Siguiente →
          </button>
        </div>
       )} */}

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
