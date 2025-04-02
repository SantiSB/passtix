import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { db } from "@/lib/firebase/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export function useQrScanner() {
  // Estado del escaner
  const [status, setStatus] = useState<string | null>(null);
  const [assistantName, setAssistantName] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const scannerRef = useRef<HTMLDivElement | null>(null);
  const hasScannedRef = useRef(false);

  useEffect(() => {
    // Si el escaner está listo y no está escaneando, iniciar el escaneo
    if (scannerRef.current && !scanning) {
      setScanning(true);

      // Crear el escaner
      const scanner = new Html5QrcodeScanner(
        "qr-reader",
        { fps: 10, qrbox: 250 },
        false
      );

      // Renderizar el escaner
      scanner.render(
        async (qrText) => {
          // Si ya se ha escaneado, no hacer nada
          if (hasScannedRef.current) return;
          hasScannedRef.current = true;

          // Establecer el estado de verificación
          setStatus("Verificando...");

          try {
            // Obtener el ticket
            const ticketRef = doc(db, "ticket", qrText);
            const ticketSnap = await getDoc(ticketRef);

            // Si el ticket no existe, establecer el estado de error
            if (!ticketSnap.exists()) {
              setStatus("❌ QR no válido");
            } else {
              // Obtener el ticket
              const ticket = ticketSnap.data();
              
              // Obtener el asistente
              const assistantId = ticket.assistantId;
              const assistantRef = doc(db, "assistant", assistantId);
              const assistantSnap = await getDoc(assistantRef);
              const assistant = assistantSnap.exists()
                ? assistantSnap.data()
                : null;

              // Si el ticket ya fue registrado, establecer el estado de error
              if (ticket.status === "joined") {
                setStatus("⚠️ Este ticket ya fue registrado.");
              } else {
                // Actualizar el ticket
                await updateDoc(ticketRef, {
                  status: "joined",
                  checkedInAt: new Date(),
                });

                // Establecer el estado de verificación
                setStatus("✅ Ingreso registrado");
              }

              // Establecer el nombre del asistente
              setAssistantName(assistant?.name || "Asistente");
            }
          } catch (err) {
            // Si hay un error, establecer el estado de error
            console.error(err);
            setStatus("❌ Error al procesar el QR");
          }

          // Esperar 3 segundos y reiniciar el escaner
          setTimeout(() => {
            hasScannedRef.current = false;
            setStatus(null);
            setAssistantName(null);
          }, 3000);
        },
        // Si hay un error, establecer el estado de error
        (errorMessage) => {
          console.warn("QR Scan error:", errorMessage);
        }
      );
    }
  }, [scanning]);

  return { status, assistantName, scannerRef };
} 