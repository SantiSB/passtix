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

  const { status, assistantName, scannerRef, scannedData } =
    useQrScanner();

  const getStatusStyles = (status: string | null) => {
    if (!status) return "";
    if (status.includes("✅")) return "text-emerald-400";
    if (status.includes("❌")) return "text-red-400";
    if (status.includes("⚠️")) return "text-yellow-400";
    return "text-white";
  };

  const relevantKeys: Record<string, string[]> = {
    "��️ Boleto": ["id", "ticketTypeName", "status", "checkedInAt", "maxEntryTime"],
    "🧑 Asistente": ["name", "email", "dni"],
    "📅 Evento": ["name", "date", "location"],
  };

  const translations: Record<string, string> = {
    id: "ID",
    type: "Tipo",
    status: "Estado",
    validationTimestamp: "Fecha de validación",
    entryTimestamp: "Fecha de entrada",
    name: "Nombre",
    email: "Correo electrónico",
    dni: "DNI",
    date: "Fecha",
    location: "Ubicación",
    ticketTypeName: "Tipo de ticket",
    price: "Precio",
    qrCode: "Código QR",
    createdAt: "Fecha de creación",
    updatedAt: "Última actualización",
    checkedInAt: "Fecha de entrada",
    maxEntryTime: "Hora límite de entrada",
    phaseName: "Fase",
    localityName: "Localidad",
    promoterName: "Promotor"
  };

  const renderDataBlock = (title: string, data: Record<string, unknown> | null) => {
    if (!data) return null;

    const keysToShow = relevantKeys[title] || Object.keys(data);

    return (
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
        <div className="text-sm text-gray-200 space-y-1">
          {Object.entries(data)
            .filter(([key]) => keysToShow.includes(key))
            .map(([key, value]) => (
              <div key={key}>
                <strong>{translations[key] || key}:</strong>{" "}
                {typeof value === "object" &&
                value !== null &&
                "toDate" in value &&
                typeof value.toDate === "function"
                  ? value.toDate().toLocaleString()
                  : value === "joined"
                  ? "Registrado"
                  : value === "disabled"
                  ? "Deshabilitado"
                  : value === "enabled"
                  ? "Habilitado"
                  : String(value)}
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
    <div className="min-h-screen h-[100dvh] overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-black flex flex-col items-center justify-center px-4 py-8 relative text-white">
      <button
        onClick={logout}
        className="absolute top-4 right-4 text-sm text-white hover:text-red-400 transition font-medium z-50"
      >
        Cerrar sesión
      </button>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <Image
          src="/branding/ImagotipoBlanco.png"
          alt="Logo PassTix"
          width={180}
          height={180}
        />
      </motion.div>

      <div className="relative w-full max-w-md rounded-2xl p-1 bg-gradient-to-tr from-amber-400 to-purple-600 shadow-2xl ring-2 ring-offset-slate-50">
        <div
          ref={scannerRef}
          className="rounded-xl overflow-hidden bg-black/80 backdrop-blur-md p-2"
        ></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mt-6 text-center"
      >
        {status ? (
          <div className="space-y-2">
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
      </motion.div>

      {/* <div className="mt-4 text-xs text-yellow-400 text-center">
        <p>
          <strong>ID de Usuario:</strong> {debugInfo?.userUid}
        </p>
        <p>
          <strong>Productor del evento:</strong> {debugInfo?.eventProducerId}
        </p>
      </div> */}

      {scannedData && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4">
          <div className="bg-gray-900 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-xl border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4 text-center">
              Escaneo exitoso
            </h2>

            {renderDataBlock("🎟️ Ticket", scannedData.ticket)}
            {renderDataBlock("🧑 Asistente", scannedData.assistant)}
            {renderDataBlock("📅 Evento", scannedData.event)}

            <button
              onClick={() => window.location.reload()}
              className="mt-6 w-full text-sm py-2 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-lg"
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
        className="absolute bottom-4 text-xs text-gray-500"
      >
        © 2025 PassTix. Todos los derechos reservados.
      </motion.div>
    </div>
  );
}
