"use client";

import { useQrScanner } from "@/hooks/useQrScanner";

export default function ScannerPage() {
  // Estado del escaner
  const { status, assistantName, scannerRef } = useQrScanner();

  // Estilos del estado
  const getStatusStyles = (status: string | null) => {
    if (!status) return "";
    if (status.includes("✅")) return "text-emerald-800";
    if (status.includes("❌")) return "text-red-500";
    if (status.includes("⚠️")) return "text-yellow-400";
    return "text-white";
  };

  return (
    <div className="min-h-screen h-[100dvh] overflow-hidden bg-black flex flex-col items-center justify-center px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 text-center">
        🎟️ Escáner de Ingreso
      </h1>

      <div className="relative w-full max-w-md rounded-2xl p-1 bg-gradient-to-tr from-emerald-600 to-black shadow-2xl ring-2 ring-emerald-800">
        <div
          id="qr-reader"
          ref={scannerRef}
          className="rounded-xl overflow-hidden bg-black/80 backdrop-blur-md p-2"
        ></div>
      </div>

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
