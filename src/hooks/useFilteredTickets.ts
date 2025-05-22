import { useMemo } from "react";
import useLiveTickets from "@/hooks/useLiveTickets";
import useTicketFilters from "@/hooks/useTicketFilters";
import useTicketSort, { SortKey, SortDirection } from "@/hooks/useTicketSort";
import { EnrichedTicket } from "@/interfaces/EnrichedTicket";

interface Filters {
  name: string;
  idNumber: string;
  ticketId: string;
}

export interface UseFilteredTicketsReturn {
  tickets: EnrichedTicket[];
  isLoading: boolean;
  isError: boolean;
  isFetching: boolean;
  usingPagination: boolean;
  pagination: null;
  sortKey: SortKey;
  sortDirection: SortDirection;
  setSort: (key: SortKey) => void;
}

export default function useFilteredTickets(
  eventId: string,
  filters: Filters
): UseFilteredTicketsReturn {
  const { tickets: liveTickets, loading } = useLiveTickets(eventId);
  const { sortKey, sortDirection, toggleSort: setSort } = useTicketSort();

  const filteredTickets = useTicketFilters(liveTickets, filters);

  const sortedTickets = useMemo(() => {
    const normalize = (val: unknown) => {
      if (val == null) return "";
      if (val instanceof Date) return val.getTime();
      return typeof val === "string" ? val.toLowerCase() : val;
    };

    return [...filteredTickets].sort((a, b) => {
      const aVal = normalize(a[sortKey as keyof EnrichedTicket]);
      const bVal = normalize(b[sortKey as keyof EnrichedTicket]);

      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredTickets, sortKey, sortDirection]);

  return {
    tickets: sortedTickets,
    isLoading: loading,
    isError: false,
    isFetching: loading,
    usingPagination: false,
    pagination: null,
    sortKey,
    sortDirection,
    setSort,
  };
}
