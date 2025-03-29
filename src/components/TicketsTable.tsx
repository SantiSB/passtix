import { useEffect, useState } from "react";

interface EnrichedTicket {
  id: string;
  ticketType: string;
  price: number | null;
  status: string;
  emailStatus: string;
  qrCode: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  checkedInAt: Date | null;
  identificationNumber: string;

  assistantName: string;
  assistantEmail: string;
  phoneNumber: string;
  phaseName: string;
  localityName: string;
  promoterName?: string;
  discountAmount?: number;
  discountType?: string;
}

const getStatusBadgeClass = (status: string) => {
  switch (status.toLowerCase()) {
    case "enabled":
      return "bg-blue-500 text-white";
    case "joined":
      return "bg-green-500 text-white";
    case "pending":
      return "bg-yellow-500 text-white";
    case "failed":
      return "bg-red-500 text-white";
    default:
      return "bg-gray-500 text-white";
  }
};

const TicketsTable: React.FC = () => {
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

  if (loading) return <p className="p-4 text-gray-500">Cargando tickets...</p>;

  return (
    <div className="overflow-x-auto bg-white text-black">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-emerald-800 text-white font-bold">
            <th className="py-3 px-4 border-b">#</th>
            <th className="py-3 px-4 border-b">Asistente</th>
            <th className="py-3 px-4 border-b">Correo</th>
            <th className="py-3 px-4 border-b">Celular</th>
            <th className="py-3 px-4 border-b">Tipo Ticket</th>
            <th className="py-3 px-4 border-b">Precio</th>
            <th className="py-3 px-4 border-b">Fase</th>
            <th className="py-3 px-4 border-b">Localidad</th>
            <th className="py-3 px-4 border-b">Promotor</th>
            <th className="py-3 px-4 border-b">Cedula</th>
            <th className="py-3 px-4 border-b">Estado</th>
            <th className="py-3 px-4 border-b">Ingreso</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket, index) => (
            <tr key={ticket.id} className="hover:bg-gray-100">
              <td className="py-3 px-4 border-b">{index + 1}</td>
              <td className="py-3 px-4 border-b">{ticket.assistantName}</td>
              <td className="py-3 px-4 border-b">{ticket.assistantEmail}</td>
              <td className="py-3 px-4 border-b">{ticket.phoneNumber}</td>
              <td className="py-3 px-4 border-b">{ticket.ticketType}</td>
              <td className="py-3 px-4 border-b">
                {ticket.price ? `$${ticket.price}` : "—"}
              </td>
              <td className="py-3 px-4 border-b">{ticket.phaseName}</td>
              <td className="py-3 px-4 border-b">{ticket.localityName}</td>
              <td className="py-3 px-4 border-b">
                {ticket.promoterName ?? "—"}
              </td>
              <td className="py-3 px-4 border-b">
                {ticket.identificationNumber}
              </td>
              <td
                className={`py-3 px-4 border-b ${getStatusBadgeClass(
                  ticket.status
                )}`}
              >
                {ticket.status}
              </td>
              <td className="py-3 px-4 border-b">
                {ticket.checkedInAt
                  ? new Date(ticket.checkedInAt).toLocaleString()
                  : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TicketsTable;
