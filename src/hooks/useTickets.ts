import { useEffect, useState } from "react";

interface EnrichedTicket {
  id: string;
  ticketType: string;
  price: number | null;
  status: string;
  qrCode: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  checkedInAt: Date | null;
  identificationNumber: string;
  identificationType: string;
  name: string;
  email: string;
  phoneNumber: string;
  phaseName: string;
  localityName: string;
  promoterName?: string;
  discountAmount?: number;
  discountType?: string;
}

const useTickets = () => {
  const [tickets, setTickets] = useState<EnrichedTicket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await fetch("/api/tickets");
        const data = await res.json();
        if (data.success) setTickets(data.tickets);
      } catch (err) {
        console.error("Error fetching tickets", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  return { tickets, loading };
};

export default useTickets;
