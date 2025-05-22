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
  eventLocation: string;
  ticketTypeName: string; // ✅ CAMBIO aquí también
}


export async function sendTicketEmail({
  to,
  name,
  qrCodeUrl,
  ticketId,
  eventName,
  eventDate,
  eventLocation,
  ticketTypeName, // ✅
}: SendTicketEmailParams): Promise<{ success: boolean; error?: string }> {

  
  try {
    const { error } = await resend.emails.send({
      from: `${eventName} - PassTix <tickets@passtix.online>`,
      to,
      subject: `🎟️ Tu entrada para ${eventName}`,
      react: await TicketEmail({
        name,
        qrCodeUrl,
        ticketId,
        eventName,
        eventDate,
        eventLocation,
        ticketTypeName, // ✅
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
