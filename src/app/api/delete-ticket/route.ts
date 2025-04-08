import { NextRequest, NextResponse } from "next/server";
import { deleteTicket, getTicket } from "@/lib/utils/ticket";
import { deleteAssistant } from "@/lib/utils/assistant";
import { getStorage, ref, deleteObject } from "firebase/storage";

/**
 * DELETE /api/delete-ticket
 * Body: { id: string }
 */
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Falta el id del ticket." },
        { status: 400 }
      );
    }

    // 1. Leer el ticket para obtener assistantId y qrCode
    const ticket = await getTicket(id);
    if (!ticket) {
      return NextResponse.json(
        { success: false, error: "Ticket no encontrado." },
        { status: 404 }
      );
    }

    // 2. Eliminar asistente
    await deleteAssistant(ticket.assistantId);

    // 3. Eliminar ticket
    await deleteTicket(id);

    // 4. Eliminar QR en Storage
    try {
      const storage = getStorage();
      //   https://firebasestorage.googleapis.com/v0/b/BUCKET/o/qrcodes%2Ffile.png?alt=media
      // → extraemos la parte después de /o/ y la decodificamos
      const path = decodeURIComponent(
        ticket.qrCode.split("/o/")[1].split("?")[0] // qrcodes%2Ffile.png
      );
      const qrRef = ref(storage, path);
      await deleteObject(qrRef);
    } catch (qrErr) {
      // No abortamos si falla el borrado del QR; solo lo registramos
      console.error("No se pudo eliminar el QR:", qrErr);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /delete-ticket:", err);
    return NextResponse.json(
      { success: false, error: "Error interno al eliminar." },
      { status: 500 }
    );
  }
}
