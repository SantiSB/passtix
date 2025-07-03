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
    if (status.includes("❌") || status.includes("⚠️")) return "text-red-400";
    return "text-white";
  };

  const getScanResult = (status: string | null) => {
    if (!status) return { type: "scanning", reason: "" };
    if (status.includes("✅")) return { type: "success", reason: status.replace("✅", "").trim() };
    if (status.includes("❌")) return { type: "error", reason: status.replace("❌", "").trim() };
    if (status.includes("⚠️")) return { type: "error", reason: status.replace("⚠️", "").trim() };
    return { type: "scanning", reason: "" };
  };

  const relevantKeys: Record<string, string[]> = {
    "🧑 Asistente": ["name", "identificationNumber", "email"],
    "🎟️ Ticket": ["id", "ticketTypeName", "localityName", "phaseName", "checkedInAt"],
    "🤝 Promotor": ["name", "phone"],
    "📅 Evento": ["name", "location", "date"],
  };

  const translations: Record<string, string> = {
    id: "ID",
    name: "Nombre",
    identificationNumber: "Cédula",
    email: "Correo electrónico",
    ticketTypeName: "Tipo de Ticket",
    localityName: "Localidad",
    phaseName: "Fase",
    location: "Ubicación",
    date: "Fecha",
    phone: "Celular",
    checkedInAt: "Hora de escaneo",
  };

  const renderDataBlock = (title: string, data: Record<string, unknown> | null) => {
    // Validación adicional para datos nulos o vacíos
    if (!data || typeof data !== 'object' || Array.isArray(data)) return null;

    const keysToShow = relevantKeys[title] || Object.keys(data);

    // Si es la sección del promotor y no hay datos válidos, no mostrar la sección
    if (title === "🤝 Promotor") {
      const hasValidPromoterData = keysToShow.some(key => {
        const value = data[key];
        return value !== null && value !== undefined && value !== "";
      });
      if (!hasValidPromoterData) return null;
    }

    return (
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
        <div className="text-sm text-gray-200 space-y-1">
          {keysToShow.map((key) => {
            const value = data[key];
            
            // Validación adicional para el valor
            if (value === null || value === undefined) {
              return (
                <div key={key}>
                  <strong>{translations[key] || key}:</strong> No disponible
                </div>
              );
            }

            return (
              <div key={key}>
                <strong>{translations[key] || key}:</strong>{" "}
                {typeof value === "object" &&
                value !== null &&
                "toDate" in value &&
                typeof value.toDate === "function"
                  ? value.toDate().toLocaleString()
                  : key === "checkedInAt" && value
                  ? (value instanceof Date
                      ? value.toLocaleString()
                      : typeof value === "string"
                        ? new Date(value).toLocaleString()
                        : String(value))
                  : value === "joined"
                  ? "Registrado"
                  : value === "disabled"
                  ? "Deshabilitado"
                  : value === "enabled"
                  ? "Habilitado"
                  : key === "price" && value !== null
                  ? `$${Number(value).toLocaleString('es-AR')}`
                  : value === null || value === undefined || value === ""
                  ? "No disponible"
                  : String(value)}
              </div>
            );
          })}
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
            <h2 className={`text-3xl font-bold mb-4 text-center ${
              getScanResult(status).type === "success" 
                ? "text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.5)]" 
                : "text-red-400 drop-shadow-[0_0_10px_rgba(248,113,113,0.5)]"
            }`}>
              {getScanResult(status).type === "success" ? "Escaneo exitoso" : "Escaneo fallido"}
            </h2>
            
            {getScanResult(status).reason && (
              <div className="mb-4 p-3 rounded-lg bg-gray-800 text-center">
                <p className={`text-lg ${getStatusStyles(status)}`}>
                  {getScanResult(status).reason}
                </p>
              </div>
            )}

            {renderDataBlock("🧑 Asistente", scannedData.assistant)}
            {renderDataBlock("🎟️ Ticket", scannedData.ticket)}
            {renderDataBlock("🤝 Promotor", scannedData.promoter)}
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
