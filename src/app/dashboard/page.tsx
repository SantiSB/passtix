"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import EventModal from "@/components/EventModal";
import TicketModal from "@/components/TicketModal";
import EventSelector from "@/components/EventSelector";
import TicketsTable from "@/components/TicketsTable";
import { motion } from "framer-motion";
import Image from "next/image";
import useAuth from "@/hooks/useAuth";

const DashboardPage = () => {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Cargando sesión...
      </div>
    );
  }

  if (!user) return null;

  return (
    <section className="min-h-screen w-full flex flex-col">
      {/* Barra superior */}
      <header className="sticky top-0 z-20 bg-black/90 backdrop-blur-md shadow-lg">
        <div className="mx-auto flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative w-[120px] h-[40px]">
              <Image
                src="/branding/LogotipoBlanco.png"
                alt="PassTix Logo"
                fill
                sizes="(max-width: 768px) 100px, 120px"
                style={{ objectFit: "contain" }}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="flex flex-wrap gap-4 items-center"
          >
            <button
              onClick={() => setIsEventModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-lg transition transform hover:scale-105"
            >
              Crear evento
            </button>

            <button
              onClick={() => setIsTicketModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-2xl bg-amber-400 px-4 py-2 text-sm font-semibold text-black shadow-lg transition transform hover:scale-105"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Registrar asistente
            </button>

            <button
              onClick={logout}
              className="text-sm text-white hover:text-red-400 transition font-medium"
            >
              Cerrar sesión
            </button>
          </motion.div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="flex flex-1 flex-col">
        <div className="mx-auto w-full flex-1 px-4 py-10 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl"
          >
            <h2 className="text-xl font-bold text-white mb-4">Tus eventos</h2>
            <EventSelector
              selectedEventId={selectedEventId}
              onSelect={setSelectedEventId}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="mt-12"
          >
            <h2 className="text-xl font-bold text-white mb-4">Boletas</h2>
            {selectedEventId ? (
              <TicketsTable eventId={selectedEventId} />
            ) : (
              <p className="text-white">
                Selecciona un evento para ver sus boletas.
              </p>
            )}
          </motion.div>
        </div>
      </main>

      <TicketModal
        mode="create"
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        eventId={selectedEventId || ""}
      />
      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
      />
    </section>
  );
};

export default DashboardPage;
