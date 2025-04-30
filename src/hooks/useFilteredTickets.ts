import { useState, useMemo } from "react";
import usePaginatedTickets, { PAGE_SIZE } from "@/hooks/usePaginatedTickets";
import useLiveTickets from "@/hooks/useLiveTickets";
import useTicketFilters from "@/hooks/useTicketFilters";
import { EnrichedTicket } from "@/interfaces/EnrichedTicket";

interface Filters {
  name: string;
  idNumber: string;
  ticketId: string;
}

export default function useFilteredTickets(eventId: string, filters: Filters) {
  const {
    tickets: paginatedTickets,
    isLoading,
    isFetching,
    isError,
    hasMore,
    nextPage,
    prevPage,
    canGoBack,
    pageIndex,
    pageSize,
    updateSearchName,
    updateSearchIdNumber,
    updateSearchTicketId,
  } = usePaginatedTickets(eventId);

  const live = useLiveTickets(eventId);

  const [sortBy, setSortBy] = useState<keyof EnrichedTicket | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const hasFilters = Boolean(
    filters.name.trim() || filters.idNumber.trim() || filters.ticketId.trim()
  );

  const usingPagination = !hasFilters;

  const rawTickets = usingPagination ? paginatedTickets : live.tickets;

  const filteredTickets = useTicketFilters(rawTickets, filters);

  const sortedTickets = useMemo(() => {
    if (!sortBy) return filteredTickets;

    return [...filteredTickets].sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      const normalize = (val: any) => {
        if (val == null) return "";
        if (typeof val === "string" || typeof val === "number") return val;
        if (val instanceof Date) return val.getTime();
        return String(val);
      };

      const aComparable = normalize(aValue);
      const bComparable = normalize(bValue);

      if (aComparable < bComparable) return sortDirection === "asc" ? -1 : 1;
      if (aComparable > bComparable) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredTickets, sortBy, sortDirection]);

  const setSort = (field: keyof EnrichedTicket) => {
    if (sortBy === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortDirection("asc");
    }
  };

  return {
    tickets: sortedTickets,
    isLoading,
    isError,
    isFetching,
    usingPagination,
    pagination: {
      hasMore,
      nextPage,
      prevPage,
      canGoBack,
      pageIndex,
      pageSize,
    },
    updateSearchName,
    updateSearchIdNumber,
    updateSearchTicketId,
    sortBy,
    sortDirection,
    setSort,
  };
}
