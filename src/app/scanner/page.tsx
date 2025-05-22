"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQrScanner } from "@/hooks/useQrScanner";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import { motion } from "framer-motion";

export default function ScannerPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const { status, assistantName, scannerRef, debugInfo, scannedData } =
    useQrScanner();

  const getStatusStyles = (status: string | null) => {
    if (!status) return "";
    if (status.includes("✅")) return "text-emerald-400";
    if (status.includes("❌")) return "text-red-400";
    if (status.includes("⚠️")) return "text-yellow-400";
    return "text-white";
  };

  const relevantKeys: Record<string, string[]> = {
    "🎟️ Boleto": ["id", "type", "status", "validationTimestamp", "entryTimestamp"],
    "🧑 Asistente": ["name", "email", "dni"],
    "📅 Evento": ["name", "date", "location"],
  };

  const fieldLabels: Record<string, string> = {
    id: "ID",
    type: "Tipo",
    status: "Estado",
    validationTimestamp: "Validado el",
    entryTimestamp: "Ingreso el",
    name: "Nombre",
    email: "Correo",
    dni: "DNI",
    date: "Fecha",
    location: "Ubicación",
  };

  const statusTranslations: Record<string, string> = {
    enabled: "Habilitado",
    disabled: "Deshabilitado",
    used: "Usado",
    invalid: "Inválido",
  };

  const renderDataBlock = (title: string, data: Record<string, unknown> | null) => {
    if (!data) return null;
    const keysToShow = relevantKeys[title] || Object.keys(data);
    return (
      <div className="mb-4 bg-gray-800 rounded-xl p-4 shadow-md">
        <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
          {title}
        </h3>
        <div className="text-base text-gray-200 space-y-2">
          {Object.entries(data)
            .filter(([key]) => keysToShow.includes(key))
            .map(([key, value]) => (
              <div key={key} className="flex items-center gap-2">
                <span className="font-bold text-amber-400">{fieldLabels[key] || key}:</span>
                <span>
                  {key === "status" && typeof value === "string"
                    ? statusTranslations[value] || value
                    : typeof value === "object" && value !== null && "toDate" in value && typeof value.toDate === "function"
                    ? value.toDate().toLocaleString("es-ES")
                    : String(value)}
                </span>
              </div>
            ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Cargando sesión...
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen h-[100dvh] overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-black flex flex-col items-center justify-center px-2 py-4 relative text-white">
      <button
        onClick={logout}
        className="absolute top-3 right-3 text-xs text-white bg-red-500/80 hover:bg-red-600 px-3 py-1 rounded-lg shadow font-medium z-50 transition"
      >
        Cerrar sesión
      </button>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="mb-4"
      >
        <Image
          src="/branding/ImagotipoBlanco.png"
          alt="Logo PassTix"
          width={120}
          height={120}
        />
      </motion.div>

      <div className="relative w-full max-w-sm rounded-2xl p-1 bg-gradient-to-tr from-amber-400 to-purple-600 shadow-2xl ring-2 ring-offset-slate-50">
        <div
          ref={scannerRef}
          className="rounded-xl overflow-hidden bg-black/80 backdrop-blur-md p-2 min-h-[180px] flex items-center justify-center"
        ></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mt-4 text-center"
      >
        {status ? (
          <div className="space-y-2">
            {assistantName && (
              <p className="text-lg font-semibold text-white">
                {assistantName}
              </p>
            )}
            <p className={`text-base font-medium ${getStatusStyles(status)}`}>
              {status.replace("Ticket", "Boleto")}
            </p>
          </div>
        ) : (
          <p className="text-gray-400 mt-4 animate-pulse text-base">
            📷 Escaneando código QR...
          </p>
        )}
      </motion.div>

      <div className="mt-2 text-xs text-yellow-400 text-center">
        <p>
          <strong>ID de usuario:</strong> {debugInfo?.userUid}
        </p>
        <p>
          <strong>Productor del evento:</strong> {debugInfo?.eventProducerId}
        </p>
      </div>

      {scannedData && (
        <div className="fixed inset-0 bg-black/90 flex items-end justify-center z-50 px-2 py-4 sm:items-center sm:py-0">
          <div className="bg-gray-900 rounded-2xl p-4 w-full max-w-sm max-h-[85vh] overflow-y-auto shadow-2xl border border-gray-700 flex flex-col gap-2 relative">
            <h2 className="text-3xl font-bold text-emerald-400 mb-2 text-center">
              ✅ ¡Boleto válido!
            </h2>

            {renderDataBlock("🎟️ Boleto", scannedData.ticket)}
            {renderDataBlock("🧑 Asistente", scannedData.assistant)}
            {renderDataBlock("📅 Evento", scannedData.event)}

            <button
              onClick={() => window.location.reload()}
              className="mt-4 w-full text-base py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl shadow-lg"
            >
              Escanear otro boleto
            </button>
          </div>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="absolute bottom-2 text-xs text-gray-500 text-center w-full"
      >
        © 2025 PassTix. Todos los derechos reservados.
      </motion.div>
    </div>
  );
}
