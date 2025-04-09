import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPaginatedTickets } from "@/lib/utils/ticket";
import { DocumentSnapshot } from "firebase/firestore";
import { EnrichedTicket } from "@/interfaces/EnrichedTicket";

// Constante reutilizable para tamaño de página
export const PAGE_SIZE = 100;

export default function usePaginatedTickets() {
  const [pageSize] = useState(PAGE_SIZE); // Controla el tamaño de página
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null);
  const [pageCursor, setPageCursor] = useState<string | null>(null);
  const [historyStack, setHistoryStack] = useState<DocumentSnapshot[]>([]);
  const [pageIndex, setPageIndex] = useState(1); // Página actual

  const { data, isLoading, isFetching, isError, refetch } = useQuery<{
    tickets: EnrichedTicket[];
    lastDoc: DocumentSnapshot | null;
    hasMore: boolean;
  }>({
    queryKey: ["tickets", pageCursor],
    queryFn: () => fetchPaginatedTickets(pageSize, lastDoc),
    staleTime: 5000,
  });

  const nextPage = () => {
    if (data?.hasMore && data?.lastDoc) {
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

  return {
    tickets: data?.tickets ?? [],
    isLoading,
    isFetching,
    isError,
    hasMore: data?.hasMore ?? false,
    canGoBack: historyStack.length > 0,
    nextPage,
    prevPage,
    pageIndex,
    refetch,
    pageSize, // Exponemos también este valor por si lo necesitas
  };
}
