"use client";

import { useQrScanner } from "@/hooks/useQrScanner";
import { Img } from "@react-email/components";

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
      <Img
        src="https://firebasestorage.googleapis.com/v0/b/passtix-f9e3e.firebasestorage.app/o/piso12%2Flogo_piso12_negro.png?alt=media&token=19ecaf49-ddec-48e2-bdfa-824f4ea8ebb4"
        alt="Logo Piso 12"
        width="220"
        style={{ margin: "0 auto 16px" }}
      />

      <div className="relative w-full max-w-md rounded-2xl p-1 bg-gradient-to-tr from-slate-50 to-black shadow-2xl ring-2 ring-offset-slate-50">
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
