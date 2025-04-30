import { EnrichedTicket } from "@/interfaces/EnrichedTicket";
import { SortKey, SortDirection } from "./useTicketSort";

export default function useSortedTickets(
  tickets: EnrichedTicket[],
  sortKey: SortKey,
  sortDirection: SortDirection
) {
  const sorted = [...tickets].sort((a, b) => {
    const aVal = a[sortKey];
    const bVal = b[sortKey];

    if (aVal == null && bVal == null) return 0;
    if (aVal == null) return sortDirection === "asc" ? 1 : -1;
    if (bVal == null) return sortDirection === "asc" ? -1 : 1;

    const aComparable =
      aVal instanceof Date
        ? aVal.getTime()
        : typeof aVal === "string"
          ? aVal.toLowerCase()
          : aVal;

    const bComparable =
      bVal instanceof Date
        ? bVal.getTime()
        : typeof bVal === "string"
          ? bVal.toLowerCase()
          : bVal;

    if (aComparable < bComparable) return sortDirection === "asc" ? -1 : 1;
    if (aComparable > bComparable) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  return sorted;
}
