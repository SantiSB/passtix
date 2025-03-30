import { Assistant } from "@/interfaces/Assistant";
import { db } from "./firebase/firebase";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { v4 as uuid } from "uuid";
import { IdentificationType } from "@/types/enums";

/**
 * Crea un nuevo asistente
 */
export async function createAssistant(
  name: string,
  email: string,
  phoneNumber: string,
  identificationNumber: string,
  identificationType: IdentificationType
): Promise<Assistant> {
  const id = uuid();

  const assistant: Assistant = {
    id,
    name,
    email,
    phoneNumber,
    identificationNumber,
    identificationType,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await setDoc(doc(db, "assistant", id), assistant);
  return assistant;
}

/**
 * Obtiene todos los asistentes registrados
 */
export async function getAssistants(): Promise<Assistant[]> {
  const snapshot = await getDocs(collection(db, "assistant"));
  return snapshot.docs.map((doc) => doc.data() as Assistant);
}
