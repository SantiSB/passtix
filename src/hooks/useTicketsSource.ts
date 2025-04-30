import usePaginatedTickets from "@/hooks/usePaginatedTickets";
import useLiveTickets from "@/hooks/useLiveTickets";

export default function useTicketsSource(
  eventId: string,
  filters: { name: string; idNumber: string; ticketId: string }
) {
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
    searchName,
    searchIdNumber,
    updateSearchName,
    updateSearchIdNumber,
    updateSearchTicketId,
  } = usePaginatedTickets(eventId);

  const live = useLiveTickets(eventId);

  const hasFilters =
    filters.name.trim() || filters.idNumber.trim() || filters.ticketId.trim();

  const usingPagination = !hasFilters;
  const rawTickets = usingPagination ? paginatedTickets : live.tickets;

  return {
    rawTickets,
    usingPagination,
    hasFilters,
    pagination: {
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
      updateSearchTicketId,
    },
    liveLoading: live.loading,
  };
}
