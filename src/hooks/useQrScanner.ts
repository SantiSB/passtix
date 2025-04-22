import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { db } from "@/lib/firebase/firebase";
import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";

export function useQrScanner() {
  const [status, setStatus] = useState<string | null>(null);
  const [assistantName, setAssistantName] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const hasScannedRef = useRef(false);

  useEffect(() => {
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
              } else {
                const ticket = ticketSnap.data();
                const assistantRef = doc(db, "assistant", ticket.assistantId);
                const assistantSnap = await getDoc(assistantRef);
                const assistant = assistantSnap.exists()
                  ? assistantSnap.data()
                  : null;

                // Validar hora máxima de entrada si tiene fase
                if (ticket.phaseId) {
                  const phaseRef = doc(db, "phase", ticket.phaseId);
                  const phaseSnap = await getDoc(phaseRef);
                  if (phaseSnap.exists()) {
                    const phase = phaseSnap.data();
                    const maxEntryTime: Timestamp = phase.maxEntryTime;

                    const now = new Date();
                    const maxTime = maxEntryTime.toDate();

                    if (now > maxTime) {
                      await updateDoc(ticketRef, {
                        status: "disabled",
                      });
                      setStatus("❌ Ticket inhabilitado por horario");
                      setAssistantName(assistant?.name || "Asistente");
                      resetScanner();
                      return;
                    }
                  }
                }

                if (ticket.status === "joined") {
                  setStatus("⚠️ Este ticket ya fue registrado.");
                } else {
                  await updateDoc(ticketRef, {
                    status: "joined",
                    checkedInAt: new Date(),
                  });
                  setStatus("✅ Ingreso registrado");
                }

                setAssistantName(assistant?.name || "Asistente");
              }
            } catch (err) {
              console.error("❌ Error escaneando QR:", err);
              setStatus("❌ Error al procesar el QR");
            }

            resetScanner();
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
  }, []);

  return { status, assistantName, scannerRef: containerRef };
}
