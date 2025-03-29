// app/api/assistants/[id]/tickets/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getTicketsByAssistantId } from '@/lib/ticket';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Falta el ID del asistente' }, { status: 400 });
    }

    const tickets = await getTicketsByAssistantId(id);
    return NextResponse.json({ success: true, tickets });
  } catch (error: unknown) {
    console.error('[API /assistants/[id]/tickets] Error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 }
    );
  }
}
