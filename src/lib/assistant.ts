// services/assistants.ts

import { Assistant } from '@/interfaces/Assistant';
import { db, storage } from './firebase'; // Asegúrate de exportar también "storage" en tu configuración
import { collection, doc, setDoc, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import QRCode from 'qrcode';
import { v4 as uuid } from 'uuid';

export async function createAssistant(
  name: string,
  email: string,
  cellPhone: string,
  identificationCard: string,
  ticketType: 'General' | 'VIP' | 'Backstage'
): Promise<Assistant> {
  const id = uuid(); // ID único para el invitado

  // Texto o contenido que deseas en el QR (puede ser el id o una URL con query params)
  const qrText = id;

  // Generar el QR como Buffer en formato PNG
  const qrBuffer = await QRCode.toBuffer(qrText, { type: 'png' });

  // Crea una referencia en Storage con el nombre del archivo
  // Aquí usamos la carpeta 'qrcodes' en Storage
  const storageRef = ref(storage, `qrcodes/${id}.png`);

  // Subir el buffer del QR a Firebase Storage
  await uploadBytes(storageRef, qrBuffer, { contentType: 'image/png' });

  // Obtener la URL de descarga que guardaremos en Firestore
  const qrCodeUrl = await getDownloadURL(storageRef);

  // Estructuramos nuestro objeto "Assistant" para guardar
  const assistant: Assistant = {
    id,
    identificationCard,
    name,
    email,
    cellPhone,
    ticketType,
    status: 'enabled',
    qrCode: qrCodeUrl,
    createdAt: new Date(),
    updatedAt: new Date(),
    checkedInAt: null,
  };

  // Guardar los datos del asistente en Firestore
  await setDoc(doc(collection(db, 'assistants'), id), assistant);

  return assistant;
}

export async function getAssistants(): Promise<Assistant[]> {
  const assistantsCollection = collection(db, 'assistants');
  const assistantsSnapshot = await getDocs(assistantsCollection);
  const assistantsList = assistantsSnapshot.docs.map((doc) => doc.data() as Assistant);
  return assistantsList;
}
