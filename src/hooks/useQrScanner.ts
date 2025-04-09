import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { db } from "@/lib/firebase/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export function useQrScanner() {
  const [status, setStatus] = useState<string | null>(null);
  const [assistantName, setAssistantName] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const scannerRef = useRef<HTMLDivElement | null>(null);
  const hasScannedRef = useRef(false);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    const startScanner = async () => {
      if (!scannerRef.current || scanning) return;

      setScanning(true);

      const qrCodeRegionId = "qr-reader";
      html5QrCodeRef.current = new Html5Qrcode(qrCodeRegionId);

      try {
        await html5QrCodeRef.current.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: 250,
          },
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
      } catch (error) {
        console.error("Error al iniciar el escáner:", error);
        setStatus("❌ No se pudo acceder a la cámara");
      }
    };

    startScanner();

    return () => {
      if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
        html5QrCodeRef.current.stop().then(() => {
          html5QrCodeRef.current?.clear();
        });
      }
    };
  }, [scanning]);

  return { status, assistantName, scannerRef };
}
