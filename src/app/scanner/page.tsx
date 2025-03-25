'use client';

import { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function ScannerPage() {
  const [status, setStatus] = useState<string | null>(null);
  const [assistantName, setAssistantName] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const scannerRef = useRef<HTMLDivElement | null>(null);
  const hasScannedRef = useRef(false); // Para evitar escaneos dobles

  useEffect(() => {
    if (scannerRef.current && !scanning) {
      setScanning(true);

      const scanner = new Html5QrcodeScanner(
        'qr-reader',
        { fps: 10, qrbox: 250 },
        false
      );
      
      scanner.render(
        async (qrText) => {
          if (hasScannedRef.current) return;
          hasScannedRef.current = true;

          setStatus('Verificando...');
          try {
            const docRef = doc(db, 'assistants', qrText);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
              const data = docSnap.data();
              setAssistantName(data.name);

              if (data.status === 'joined') {
                setStatus('⚠️ Este asistente ya ingresó.');
              } else {
                await updateDoc(docRef, {
                  status: 'joined',
                  checkedInAt: new Date(),
                });
                setStatus('✅ Ingreso registrado');
              }
            } else {
              setStatus('❌ QR no válido');
            }
          } catch (err) {
            console.error(err);
            setStatus('❌ Error al procesar el QR');
          }

          // Reiniciar escaneo luego de 3 segundos
          setTimeout(() => {
            hasScannedRef.current = false;
            setStatus(null);
            setAssistantName(null);
          }, 3000);
        },
        (errorMessage) => {
          console.warn('QR Scan error:', errorMessage);
        }
      );
    }
  }, [scanning]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-4">Escáner de Ingreso</h1>
      <div id="qr-reader" className="w-full max-w-sm" ref={scannerRef}></div>
      {status && (
        <div className="mt-6 text-center space-y-2">
          {assistantName && <p className="text-xl font-semibold">{assistantName}</p>}
          <p className="text-lg">{status}</p>
        </div>
      )}
    </div>
  );
}
