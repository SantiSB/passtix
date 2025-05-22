import { useState } from "react";

export type SortKey =
  | "name"
  | "price"
  | "status"
  | "createdAt"
  | "updatedAt"
  | "checkedInAt"
  | "ticketTypeName"
  | "phaseName"
  | "localityName"
  | "promoterName";

export type SortDirection = "asc" | "desc";

export default function useTicketSort() {
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  return { sortKey, sortDirection, toggleSort };
}
