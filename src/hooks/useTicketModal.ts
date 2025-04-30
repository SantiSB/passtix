import { useState } from "react";
import { EnrichedTicket } from "@/interfaces/EnrichedTicket";

type ModalMode = "edit" | "delete" | null;

export default function useTicketModal() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedTicket, setSelectedTicket] = useState<EnrichedTicket | null>(
    null
  );

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
  };

  return {
    isModalOpen,
    modalMode,
    selectedTicket,
    openEditModal,
    openDeleteModal,
    closeModal,
  };
}
