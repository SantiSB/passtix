import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

export default function useDeleteTicket(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const deleteTicket = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/delete-ticket", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Error eliminando ticket");
      }
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      onSuccess?.();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error desconocido";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return { deleteTicket, loading, error };
}
