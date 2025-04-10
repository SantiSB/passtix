import { Resend } from "resend";
import TicketEmail from "@/components/email/TicketEmail";

// Inicializar Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Enviar email de ticket
export async function sendTicketEmail({
  to,
  name,
  qrCodeUrl,
  ticketId,
}: {
  to: string;
  name: string;
  qrCodeUrl: string;
  ticketId: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await resend.emails.send({
      from: "Piso 12 - PassTix <notificaciones@piso12.com>",
      to,
      subject: `🎟️ Entrada Piso 12 - BICHIYAL`,
      react: await TicketEmail({
        name,
        qrCodeUrl,
        ticketId,
      }),
    });

    if (error) {
      console.error(error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: unknown) {
    console.error(err);
    return { success: false, error: err instanceof Error ? err.message : "Error al enviar el email" };
  }
}
