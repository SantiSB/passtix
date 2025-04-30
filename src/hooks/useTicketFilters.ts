import { useMemo } from "react";
import { EnrichedTicket } from "@/interfaces/EnrichedTicket";

interface Filters {
  name?: string;
  idNumber?: string;
  ticketId?: string;
}

export default function useTicketFilters(
  tickets: EnrichedTicket[],
  filters: Filters
): EnrichedTicket[] {
  const { name = "", idNumber = "", ticketId = "" } = filters;

  return useMemo(() => {
    const normalizedName = name.trim().toLowerCase();
    const normalizedId = idNumber.trim();
    const normalizedTicketId = ticketId.trim().toLowerCase();

    return tickets.filter((ticket) => {
      const matchName = normalizedName
        ? ticket.name.toLowerCase().includes(normalizedName)
        : true;

      const matchId = normalizedId
        ? ticket.identificationNumber.includes(normalizedId)
        : true;

      const matchTicketId = normalizedTicketId
        ? ticket.id.toLowerCase().includes(normalizedTicketId)
        : true;

      return matchName && matchId && matchTicketId;
    });
  }, [tickets, name, idNumber, ticketId]);
}
