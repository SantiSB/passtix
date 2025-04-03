import { Assistant } from "@/interfaces/Assistant";
import { db } from "../firebase/firebase";
import {  doc, getDoc, setDoc } from "firebase/firestore";
import { v4 as uuid } from "uuid";
import { IdentificationType } from "@/types/enums";

// Crea un nuevo asistente
export async function createAssistant(
  name: string,
  email: string,
  phoneNumber: string,
  identificationNumber: string,
  identificationType: IdentificationType
): Promise<Assistant> {

  // Generar ID del asistente
  const id = uuid();

  // Crear asistente
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

  // Devolver asistente creado
  return assistant;
}

// Guarda un asistente en Firestore
export async function saveAssistant(assistant: Assistant): Promise<void> {
  await setDoc(doc(db, "assistant", assistant.id), assistant);
}

// Obtiene un asistente por su ID
export async function getAssistant(id: string): Promise<Assistant | null> {
  const snapshot = await getDoc(doc(db, "assistant", id));
  return snapshot.data() as Assistant | null;
}

// Actualiza un asistente existente en Firestore
export async function updateAssistant(
  id: string,
  updates: Partial<Omit<Assistant, "id" | "createdAt">>
): Promise<{ success: boolean }> {
  try {
    const assistantRef = doc(db, "assistant", id);
    const assistantSnap = await getDoc(assistantRef);

    if (!assistantSnap.exists()) {
      return { success: false };
    }

    const existingData = assistantSnap.data() as Assistant;

    const updatedAssistant: Assistant = {
      ...existingData,
      ...updates,
      updatedAt: new Date(),
    };

    await setDoc(assistantRef, updatedAssistant);
    return { success: true };
  } catch (error) {
    console.error("Error updating assistant:", error);
    return { success: false };
  }
}