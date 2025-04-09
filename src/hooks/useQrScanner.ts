import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { db } from "@/lib/firebase/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export function useQrScanner() {
  const [status, setStatus] = useState<string | null>(null);
  const [assistantName, setAssistantName] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const hasScannedRef = useRef(false);

  useEffect(() => {
    const tryStart = async () => {
      // 🔁 Esperamos a que el contenedor exista en el DOM
      if (!containerRef.current) {
        console.warn("⏳ containerRef aún no montado, reintentando...");
        setTimeout(tryStart, 200); // Reintenta en 200ms
        return;
      }

      const regionId = `qr-reader-${Date.now()}`;
      const scannerDiv = document.createElement("div");
      scannerDiv.id = regionId;
      containerRef.current.innerHTML = "";
      containerRef.current.appendChild(scannerDiv);

      console.log("🟢 Inicializando escáner en:", regionId);
      const html5QrCode = new Html5Qrcode(regionId);
      scannerRef.current = html5QrCode;

      try {
        await html5QrCode.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: 250 },
          async (qrText) => {
            console.log("✅ QR detectado:", qrText);
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

            setTimeout(() => {
              hasScannedRef.current = false;
              setStatus(null);
              setAssistantName(null);
            }, 3000);
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

    tryStart();

    return () => {
      scannerRef.current?.stop().then(() => {
        scannerRef.current?.clear();
        console.log("🛑 Scanner detenido");
      });
    };
  }, []);

  return { status, assistantName, scannerRef: containerRef };
}
