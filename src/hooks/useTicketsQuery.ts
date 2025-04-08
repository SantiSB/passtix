// hooks/useTicketsQuery.ts
import { useQuery } from "@tanstack/react-query";
import {
  getDocs,
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import { useState } from "react";
import { EnrichedTicket } from "@/interfaces/EnrichedTicket";
import { db } from "@/lib/firebase/firebase";

const PAGE_SIZE = 10;

export function useTicketsQuery(
  sortField: "status" | "name" | "promoterName" = "name"
) {
  const [pageIndex, setPageIndex] = useState(0);
  const [lastDoc, setLastDoc] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [prevDocs, setPrevDocs] = useState<
    QueryDocumentSnapshot<DocumentData>[]
  >([]);

  const {
    data: tickets = [],
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useQuery<EnrichedTicket[]>({
    queryKey: ["tickets", pageIndex, sortField],
    queryFn: async () => {
      let q;
      const colRef = collection(db, "tickets");

      if (pageIndex === 0) {
        q = query(colRef, orderBy(sortField), limit(PAGE_SIZE));
      } else if (lastDoc) {
        q = query(colRef, orderBy(sortField), startAfter(lastDoc), limit(PAGE_SIZE));
      } else {
        console.warn("No hay documento base para paginar");
        return [];
      }

      const snapshot = await getDocs(q);
      const docs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as EnrichedTicket[];

      const newLastDoc = snapshot.docs[snapshot.docs.length - 1];
      if (pageIndex > prevDocs.length && lastDoc) {
        setPrevDocs((prev) => [...prev, lastDoc]);
      }
      setLastDoc(newLastDoc ?? null);

      console.log("✅ Tickets cargados:", docs.length);
      return docs;
    },
    refetchOnWindowFocus: true,
  });

  const nextPage = () => {
    if (!isFetching) setPageIndex((prev) => prev + 1);
  };

  const prevPage = () => {
    if (pageIndex > 0) {
      const newIndex = pageIndex - 1;
      const prev = prevDocs[newIndex - 1] ?? null;
      setLastDoc(prev);
      setPageIndex(newIndex);
    }
  };

  return {
    tickets,
    isLoading,
    isError,
    isFetching,
    refetch,
    nextPage,
    prevPage,
    pageIndex,
    sortField,
    setSortField: (field: typeof sortField) => {
      setPageIndex(0);
      setPrevDocs([]);
      setLastDoc(null);
    },
  };
}
