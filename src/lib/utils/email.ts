import { Resend } from "resend";
import TicketEmail from "@/components/email/TicketEmail";

// Initializar Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Enviar email de ticket
export async function sendTicketEmail({
  to,
  name,
  qrCodeUrl,
}: {
  to: string;
  name: string;
  qrCodeUrl: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await resend.emails.send({
      from: "PassTix <notificaciones@piso12.com>",
      to,
      subject: `🎟️ Tu entrada para BICHIYAL`,
      react: await TicketEmail({
        name,
        qrCodeUrl,
      }),
    });

    if (error) {
      console.error(error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error(err);
    return { success: false, error: err.message || "Error al enviar el email" };
  }
}
