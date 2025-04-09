import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPaginatedTickets } from "@/lib/utils/ticket";
import { DocumentSnapshot } from "firebase/firestore";

// Constante reutilizable para tamaño de página
export const PAGE_SIZE = 5;

export default function usePaginatedTickets() {
  const [pageSize] = useState(PAGE_SIZE);
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null);
  const [pageCursor, setPageCursor] = useState<string | null>(null);
  const [historyStack, setHistoryStack] = useState<DocumentSnapshot[]>([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data = { tickets: [], lastDoc: null, hasMore: false },
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["tickets", pageCursor, searchTerm],
    queryFn: () => fetchPaginatedTickets(pageSize, lastDoc, searchTerm),
    staleTime: 5000,
  });

  const nextPage = () => {
    if (data.hasMore && data.lastDoc) {
      setHistoryStack((prev) => [...prev, lastDoc!]);
      setLastDoc(data.lastDoc);
      setPageCursor(data.lastDoc.id);
      setPageIndex((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    const newStack = [...historyStack];
    const prev = newStack.pop() || null;
    setHistoryStack(newStack);
    setLastDoc(prev);
    setPageCursor(prev?.id || null);
    setPageIndex((prev) => Math.max(prev - 1, 1));
  };

  const updateSearchTerm = (term: string) => {
    setSearchTerm(term);
    setLastDoc(null);
    setPageCursor(null);
    setHistoryStack([]);
    setPageIndex(1);
  };

  return {
    tickets: data.tickets,
    isLoading,
    isFetching,
    isError,
    hasMore: data.hasMore,
    canGoBack: historyStack.length > 0,
    nextPage,
    prevPage,
    pageIndex,
    refetch,
    pageSize,
    searchTerm,
    updateSearchTerm,
  };
}
