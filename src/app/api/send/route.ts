import TicketEmail from "@/components/TicketEmail";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);  

export async function POST(request: Request) {
  try {
    const {
      name,
      eventName,
      eventDate,
      eventTime,
      venueName,
      venueAddress,
      ticketStatus,
      qrCodeUrl,
      producerName
    } = await request.json();

    const emailContent = await TicketEmail({
      name,
      eventName,
      eventDate,
      eventTime,
      venueName,
      venueAddress,
      ticketStatus,
      qrCodeUrl,
      producerName
    });

    const { data, error } = await resend.emails.send({
      from: "Piso 12 <onboarding@resend.dev>",
      to: ["a.santiago.salas.b@gmail.com"],
      subject: "Ticket Bichiyal",
      react: emailContent,
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
