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

  const { status, assistantName, scannerRef, debugInfo } = useQrScanner();

  const getStatusStyles = (status: string | null) => {
    if (!status) return "";
    if (status.includes("✅")) return "text-emerald-400";
    if (status.includes("❌")) return "text-red-400";
    if (status.includes("⚠️")) return "text-yellow-400";
    return "text-white";
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

      <div className="mt-4 text-xs text-yellow-400 text-center">
        <p>
          <strong>UID usuario:</strong> {debugInfo?.userUid}
        </p>
        <p>
          <strong>Producer del evento:</strong> {debugInfo?.eventProducerId}
        </p>
      </div>

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
