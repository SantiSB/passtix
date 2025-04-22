import { Resend } from "resend";
import TicketEmail from "@/components/email/TicketEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendTicketEmailParams {
  to: string;
  name: string;
  qrCodeUrl: string;
  ticketId: string;
  eventName: string;
  eventDate: string;
  eventVenue: string;
  eventAddress: string;
  eventCity: string;
}

// Envía el correo con el template dinámico
export async function sendTicketEmail({
  to,
  name,
  qrCodeUrl,
  ticketId,
  eventName,
  eventDate,
  eventVenue,
  eventAddress,
  eventCity,
}: SendTicketEmailParams): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await resend.emails.send({
      from: `${eventName} - PassTix <notificaciones@piso12.com>`,
      to,
      subject: `🎟️ Tu entrada para ${eventName}`,
      react: await TicketEmail({
        name,
        qrCodeUrl,
        ticketId,
        eventName,
        eventDate,
        eventVenue,
        eventAddress,
        eventCity,
      }),
    });

    if (error) {
      console.error(error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: unknown) {
    console.error(err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Error al enviar el email",
    };
  }
}
