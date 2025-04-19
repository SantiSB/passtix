import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPaginatedTickets } from "@/lib/utils/ticket";
import { DocumentSnapshot } from "firebase/firestore";

export const PAGE_SIZE = 100;

export default function usePaginatedTickets(eventId: string) {
  const [pageSize] = useState(PAGE_SIZE);
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null);
  const [pageCursor, setPageCursor] = useState<string | null>(null);
  const [historyStack, setHistoryStack] = useState<DocumentSnapshot[]>([]);
  const [pageIndex, setPageIndex] = useState(1);

  const [searchName, setSearchName] = useState("");
  const [searchIdNumber, setSearchIdNumber] = useState("");

  const queryFn = useMemo(() => {
    return () =>
      fetchPaginatedTickets(
        pageSize,
        lastDoc,
        searchName,
        searchIdNumber,
        eventId
      );
  }, [pageSize, lastDoc, searchName, searchIdNumber, eventId]);

  const {
    data = { tickets: [], lastDoc: null, hasMore: false },
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useQuery({
    queryKey: [
      "tickets",
      pageCursor,
      lastDoc?.id,
      searchName,
      searchIdNumber,
      eventId,
    ],
    queryFn,
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

  const updateSearchName = (name: string) => {
    setSearchName(name);
    resetPagination();
  };

  const updateSearchIdNumber = (id: string) => {
    setSearchIdNumber(id);
    resetPagination();
  };

  const resetPagination = () => {
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
    searchName,
    searchIdNumber,
    updateSearchName,
    updateSearchIdNumber,
  };
}
