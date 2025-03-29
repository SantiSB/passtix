// app/api/assistants/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db, storage } from '@/lib/firebase'; // Ajusta la ruta a tu config de Firebase
import { collection, doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import QRCode from 'qrcode';
import { v4 as uuid } from 'uuid';

export async function POST(req: NextRequest) {
  try {
    // 1. Leer datos del body
    const { name, email, cellPhone, identificationCard, ticketType, promoter, phase } = await req.json();
    const id = uuid();

    // 2. Generar Buffer del QR
    const qrBuffer = await QRCode.toBuffer(id, { type: 'png' });

    // 3. Subir la imagen a Firebase Storage
    const storageRef = ref(storage, `qrcodes/${id}.png`);
    await uploadBytes(storageRef, qrBuffer, { contentType: 'image/png' });

    // 4. Obtener la URL de descarga
    const qrCodeUrl = await getDownloadURL(storageRef);

    // 5. Guardar el documento en Firestore
    const assistant = {
      id,
      name,
      email,
      cellPhone,
      identificationCard,
      ticketType,
      status: 'enabled',
      qrCode: qrCodeUrl,
      event: 'Bichiyal',
      producer: 'Piso 12',
      promoter,
      locality: 'General',
      phase,
      createdAt: new Date(),
      updatedAt: new Date(),
      checkedInAt: null,
    };

    await setDoc(doc(collection(db, 'assistants'), id), assistant);

    // 6. Retornar el asistente creado
    return NextResponse.json({ success: true, assistant });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: false, error: 'An unknown error occurred' }, { status: 500 });
  }
}
