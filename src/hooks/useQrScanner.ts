import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { db } from "@/lib/firebase/firebase";
import { doc, getDoc, updateDoc, DocumentData } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";

interface EventData extends DocumentData {
  producerId?: string;
}

export function useQrScanner() {
  const [status, setStatus] = useState<string | null>(null);
  const [assistantName, setAssistantName] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState({
    userUid: "",
    eventProducerId: "",
  });

  const [scannedData, setScannedData] = useState<{
    ticket: DocumentData;
    assistant: DocumentData | null;
    event: DocumentData | null;
  } | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const hasScannedRef = useRef(false);

  const { user } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user || !user.uid) return;

    const tryStart = async () => {
      if (!containerRef.current) {
        setTimeout(tryStart, 200);
        return;
      }

      const regionId = `qr-reader-${Date.now()}`;
      const scannerDiv = document.createElement("div");
      scannerDiv.id = regionId;
      containerRef.current.innerHTML = "";
      containerRef.current.appendChild(scannerDiv);

      const html5QrCode = new Html5Qrcode(regionId);
      scannerRef.current = html5QrCode;

      try {
        await html5QrCode.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: 250 },
          async (qrText) => {
            if (hasScannedRef.current) return;
            hasScannedRef.current = true;
            setStatus("Verificando...");

            try {
              const ticketRef = doc(db, "ticket", qrText);
              const ticketSnap = await getDoc(ticketRef);

              if (!ticketSnap.exists()) {
                setStatus("❌ QR no válido");
                resetScanner();
                return;
              }

              const ticket = ticketSnap.data();
              const eventRef = doc(db, "event", ticket.eventId);
              const eventSnap = await getDoc(eventRef);

              if (!eventSnap.exists()) {
                setStatus("❌ Evento no encontrado.");
                resetScanner();
                return;
              }

              const event = eventSnap.data() as EventData;

              setDebugInfo({
                userUid: user.uid,
                eventProducerId: event?.producerId || "",
              });

              if (
                String(event?.producerId).trim() !== String(user.uid).trim()
              ) {
                setStatus("❌ Este ticket no pertenece a tus eventos.");
                resetScanner();
                return;
              }

              const assistantRef = doc(db, "assistant", ticket.assistantId);
              const assistantSnap = await getDoc(assistantRef);
              const assistant = assistantSnap.exists()
                ? assistantSnap.data()
                : null;

              const ticketTypeRef = doc(db, "ticketType", ticket.ticketTypeId);
              const ticketTypeSnap = await getDoc(ticketTypeRef);
              const ticketType = ticketTypeSnap.exists()
                ? ticketTypeSnap.data()
                : null;

              const now = new Date();

              // Validar maxEntryTime desde phase
              const maxEntryTime =
                (ticket.phaseId &&
                  (await getDoc(doc(db, "phase", ticket.phaseId)))
                    .data()
                    ?.maxEntryTime?.toDate?.()) ??
                null;

              if (maxEntryTime && now > maxEntryTime) {
                await updateDoc(ticketRef, {
                  status: "disabled",
                });
                setStatus("❌ Ticket inhabilitado por horario");
                setAssistantName(assistant?.name || "Asistente");
                setScannedData({
                  ticket: {
                    ...ticket,
                    ticketTypeName: ticketType?.name ?? "—",
                    maxEntryTime,
                  },
                  assistant,
                  event,
                });
                return;
              }

              if (ticket.status === "disabled") {
                setStatus("❌ Este ticket está deshabilitado.");
              } else if (ticket.status !== "joined") {
                await updateDoc(ticketRef, {
                  status: "joined",
                  checkedInAt: now,
                });
                queryClient.invalidateQueries({ queryKey: ["tickets"] });
                setStatus("✅ Ingreso registrado");
              } else {
                setStatus("⚠️ Este ticket ya fue registrado.");
              }

              setAssistantName(assistant?.name || "Asistente");
              setScannedData({
                ticket: {
                  ...ticket,
                  ticketTypeName: ticketType?.name ?? "—",
                  maxEntryTime,
                },
                assistant,
                event,
              });
            } catch (err: unknown) {
              let errorMessage = "al procesar el QR";
              if (err instanceof Error) {
                errorMessage = err.message;
              }
              console.error("❌ Error escaneando QR:", err);
              setStatus(`❌ Error: ${errorMessage}`);
              resetScanner();
            }
          },
          (err) => {
            console.warn("⚠️ Error al escanear:", err);
          }
        );
      } catch (err) {
        console.error("❌ No se pudo iniciar la cámara:", err);
        setStatus("❌ No se pudo acceder a la cámara");
      }
    };

    const resetScanner = () => {
      setTimeout(() => {
        hasScannedRef.current = false;
        setStatus(null);
        setAssistantName(null);
      }, 3000);
    };

    tryStart();

    return () => {
      scannerRef.current?.stop().then(() => {
        scannerRef.current?.clear();
      });
    };
  }, [user, queryClient]);

  return {
    status,
    assistantName,
    scannerRef: containerRef,
    debugInfo,
    scannedData,
  };
}
