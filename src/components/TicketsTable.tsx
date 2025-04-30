/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import usePaginatedTickets, { PAGE_SIZE } from "@/hooks/usePaginatedTickets";
import useLiveTickets from "@/hooks/useLiveTickets";
import { EnrichedTicket } from "@/interfaces/EnrichedTicket";
import { useState, useEffect, useMemo } from "react";
import { Timestamp } from "firebase/firestore";
import TicketModal from "./TicketModal";
import { useDebounce } from "use-debounce";
import { useQueryClient } from "@tanstack/react-query";

/* ───────────────────────── types ───────────────────────── */
interface TicketsTableProps {
  eventId: string;
}

/* ───────────────────────── helpers ───────────────────────── */
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

/* ───────────────────────── component ───────────────────────── */
const TicketsTable: React.FC<TicketsTableProps> = ({ eventId }) => {
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
    searchName,
    searchIdNumber,
    updateSearchName,
    updateSearchIdNumber,
    updateSearchTicketId, // ✅ NUEVO
  } = usePaginatedTickets(eventId);

  const live = useLiveTickets(eventId);

  const [hasInitialized, setHasInitialized] = useState(false);
  const [nameInput, setNameInput] = useState(searchName);
  const [idInput, setIdInput] = useState(searchIdNumber);
  const [ticketIdInput, setTicketIdInput] = useState(""); // ✅ NUEVO

  const [debouncedName] = useDebounce(nameInput, 600);
  const [debouncedId] = useDebounce(idInput, 600);
  const [debouncedTicketId] = useDebounce(ticketIdInput, 600); // ✅ NUEVO

  const queryClient = useQueryClient();

  useEffect(() => {
    if (hasInitialized) updateSearchName(debouncedName);
  }, [debouncedName]);

  useEffect(() => {
    if (hasInitialized) updateSearchIdNumber(debouncedId);
  }, [debouncedId]);

  useEffect(() => {
    if (hasInitialized) updateSearchTicketId(debouncedTicketId); // ✅ NUEVO
  }, [debouncedTicketId]);

  useEffect(() => {
    setHasInitialized(true);
  }, []);

  const hasFilters = Boolean(
    debouncedName.trim() || debouncedId.trim() || debouncedTicketId.trim()
  );
  const usingPagination = !hasFilters;
  const rawTickets = usingPagination ? tickets : live.tickets;

  const filteredTickets = useMemo(() => {
    const n = debouncedName.trim().toLowerCase();
    const id = debouncedId.trim();
    const ticketId = debouncedTicketId.trim().toLowerCase();

    return rawTickets.filter((t) => {
      const matchName = n ? t.name.toLowerCase().includes(n) : true;
      const matchId = id ? t.identificationNumber.includes(id) : true;
      const matchTicketId = ticketId
        ? t.id.toLowerCase().includes(ticketId)
        : true;
      return matchName && matchId && matchTicketId;
    });
  }, [rawTickets, debouncedName, debouncedId, debouncedTicketId]);

  const [isModalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"edit" | "delete" | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<EnrichedTicket | null>(
    null
  );
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [errorDelete, setErrorDelete] = useState<string | null>(null);

  const openEditModal = (t: EnrichedTicket) => {
    setSelectedTicket(t);
    setModalMode("edit");
    setModalOpen(true);
  };

  const openDeleteModal = (t: EnrichedTicket) => {
    setSelectedTicket(t);
    setModalMode("delete");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedTicket(null);
    setModalMode(null);
    setErrorDelete(null);
  };

  const handleDelete = async (id: string) => {
    try {
      setLoadingDelete(true);
      const res = await fetch("/api/delete-ticket", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const json = await res.json();
      if (!res.ok || !json.success)
        throw new Error(json.error || "Error eliminando ticket");
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      closeModal();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error desconocido";
      setErrorDelete(msg);
    } finally {
      setLoadingDelete(false);
    }
  };

  if ((isLoading && usingPagination) || (live.loading && !usingPagination)) {
    return <p className="p-4 text-gray-500">Cargando tickets…</p>;
  }

  if (isError) {
    return <p className="p-4 text-red-500">Error al cargar los tickets.</p>;
  }

  return (
    <div className="rounded-xl border border-gray-200 shadow-sm bg-white">
      {/* filtros */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-end px-4 py-3 text-black">
        <input
          type="text"
          placeholder="Buscar por nombre…"
          className="border border-gray-300 px-3 py-2 rounded-md text-sm w-full text-black"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
        />
        <input
          type="text"
          placeholder="Buscar por cédula…"
          className="border border-gray-300 px-3 py-2 rounded-md text-sm w-full text-black"
          value={idInput}
          onChange={(e) => setIdInput(e.target.value)}
        />
        <input
          type="text"
          placeholder="Buscar por ID de boleta…"
          className="border border-gray-300 px-3 py-2 rounded-md text-sm w-full text-black"
          value={ticketIdInput}
          onChange={(e) => setTicketIdInput(e.target.value)}
        />
      </div>
      {isFetching && hasFilters && (
        <p className="px-4 text-sm text-gray-500 animate-pulse">
          🔎 Buscando resultados…
        </p>
      )}

      {/* tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="text-xs uppercase bg-black/90 text-white">
            <tr>
              {[
                "#",
                "ID",
                "Estado",
                "Nombre",
                "Tipo Doc",
                "Documento",
                "Tipo",
                "Precio",
                "Fase",
                "Localidad",
                "Promotor",
                "Correo",
                "Celular",
                "Creado",
                "Actualizado",
                "Ingreso",
                "URL QR",
                "Acciones",
              ].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 font-semibold whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredTickets.map((t, i) => (
              <tr key={t.id} className="even:bg-gray-50 hover:bg-gray-100">
                <td className="px-4 py-3">
                  {usingPagination
                    ? (pageIndex - 1) * PAGE_SIZE + i + 1
                    : i + 1}
                </td>
                <td className="px-4 py-3">{t.id}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClass(t.status)}`}
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
                    className="text-blue-600 underline hover:text-blue-800 text-xs break-all"
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

      {/* paginación */}
      {usingPagination && (
        <div className="flex justify-between items-center p-4">
          <button
            onClick={prevPage}
            disabled={!canGoBack || isFetching}
            className="px-3 py-2 bg-amber-400 text-black rounded-lg shadow-md hover:scale-105 disabled:bg-gray-300 disabled:text-gray-500 disabled:opacity-50"
          >
            ← Anterior
          </button>
          <span className="text-sm text-gray-600">
            Página <strong>{pageIndex}</strong>
          </span>
          <button
            onClick={nextPage}
            disabled={!hasMore || isFetching}
            className="px-3 py-2 bg-amber-400 text-black rounded-lg shadow-md hover:scale-105 disabled:bg-gray-300 disabled:text-gray-500 disabled:opacity-50"
          >
            Siguiente →
          </button>
        </div>
      )}

      {/* modal */}
      {selectedTicket && modalMode && (
        <TicketModal
          isOpen={isModalOpen}
          onClose={closeModal}
          mode={modalMode}
          ticket={selectedTicket}
          eventId={eventId}
          onConfirmDelete={() => handleDelete(selectedTicket.id)}
          loadingDelete={loadingDelete}
          errorDelete={errorDelete}
        />
      )}
    </div>
  );
};

export default TicketsTable;
