import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { db } from "@/lib/firebase/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export function useQrScanner() {
  const [status, setStatus] = useState<string | null>(null);
  const [assistantName, setAssistantName] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const scannerRef = useRef<HTMLDivElement | null>(null);
  const hasScannedRef = useRef(false);

  useEffect(() => {
    if (scannerRef.current && !scanning) {
      setScanning(true);

      const scanner = new Html5QrcodeScanner(
        "qr-reader",
        { fps: 10, qrbox: 250 },
        false
      );

      scanner.render(
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
              const assistantId = ticket.assistantId;

              const assistantRef = doc(db, "assistant", assistantId);
              const assistantSnap = await getDoc(assistantRef);
              const assistant = assistantSnap.exists()
                ? assistantSnap.data()
                : null;

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
            console.error(err);
            setStatus("❌ Error al procesar el QR");
          }

          setTimeout(() => {
            hasScannedRef.current = false;
            setStatus(null);
            setAssistantName(null);
          }, 3000);
        },
        (errorMessage) => {
          console.warn("QR Scan error:", errorMessage);
        }
      );
    }
  }, [scanning]);

  return { status, assistantName, scannerRef };
} 