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
  const hasScannedRef = useRef(false);

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

  const getStatusStyles = (status: string | null) => {
    if (!status) return '';
    if (status.includes('✅')) return 'text-emerald-800';  // Éxito
    if (status.includes('❌')) return 'text-red-500';      // Error
    if (status.includes('⚠️')) return 'text-yellow-400';  // Advertencia
    return 'text-white'; // Default
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 py-8">
      {/* Título principal */}
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 text-center">
        🎟️ Escáner de Ingreso
      </h1>

      {/* Contenedor del escáner */}
      <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-4 ring-2 ring-emerald-800">
        <div
          id="qr-reader"
          className="w-full h-auto mx-auto"
          ref={scannerRef}
        ></div>
      </div>

      {/* Mensajes de estado */}
      <div className="mt-6 text-center">
        {status ? (
          <div className="space-y-2 transition-all duration-300">
            {assistantName && (
              <p className="text-xl font-semibold text-white">
                {assistantName}
              </p>
            )}
            <p className={`text-lg font-medium ${getStatusStyles(status)}`}>
              {status}
            </p>
          </div>
        ) : (
          <p className="text-gray-400 mt-4 animate-pulse">
            📷 Escaneando código QR...
          </p>
        )}
      </div>
    </div>
  );
}
