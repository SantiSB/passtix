'use client';

import { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { db } from '@/lib/firebase/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

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
            const ticketRef = doc(db, 'tickets', qrText);
            const ticketSnap = await getDoc(ticketRef);

            if (!ticketSnap.exists()) {
              setStatus('❌ QR no válido');
            } else {
              const ticket = ticketSnap.data();

              if (ticket.status === 'joined') {
                setStatus('⚠️ Este ticket ya fue registrado.');
                setAssistantName(ticket.name);
              } else {
                await updateDoc(ticketRef, {
                  status: 'joined',
                  checkedInAt: new Date()
                });

                setStatus('✅ Ingreso registrado');
                setAssistantName(ticket.name);
              }
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
    if (status.includes('✅')) return 'text-emerald-800';
    if (status.includes('❌')) return 'text-red-500';
    if (status.includes('⚠️')) return 'text-yellow-400';
    return 'text-white';
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 text-center">
        🎟️ Escáner de Ingreso
      </h1>

      <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-4 ring-2 ring-emerald-800">
        <div id="qr-reader" className="w-full h-auto mx-auto" ref={scannerRef}></div>
      </div>

      <div className="mt-6 text-center">
        {status ? (
          <div className="space-y-2 transition-all duration-300">
            {assistantName && (
              <p className="text-xl font-semibold text-white">{assistantName}</p>
            )}
            <p className={`text-lg font-medium ${getStatusStyles(status)}`}>{status}</p>
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
