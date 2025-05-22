"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";

import EventModal from "@/components/EventModal";
import TicketModal from "@/components/TicketModal";
import PhaseModal from "@/components/PhaseModal";
import PromoterModal from "@/components/PromoterModal";
import EventSelector from "@/components/EventSelector";
import TicketsTable from "@/components/TicketsTable";
import DashboardActions from "@/components/DashboardActions";
import useAuth from "@/hooks/useAuth";
import TicketTypeModal from "@/components/TicketTypeModal";
import LocalityModal from "@/components/LocalityModal";

const DashboardPage = () => {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isPhaseModalOpen, setIsPhaseModalOpen] = useState(false);
  const [isPromoterModalOpen, setIsPromoterModalOpen] = useState(false);
  const [isTicketTypeModalOpen, setIsTicketTypeModalOpen] = useState(false);
  const [isLocalityModalOpen, setIsLocalityModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Cargando sesión...
      </div>
    );
  }

  if (!user) return null;

  return (
    <section className="min-h-screen w-full flex flex-col overflow-x-hidden">
      <header className="sticky top-0 z-20 bg-black/90 backdrop-blur-md shadow-lg">
        <div className="mx-auto flex flex-wrap items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
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

          <motion.button
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            onClick={logout}
            className="text-sm text-white hover:text-red-400 transition font-medium"
          >
            Cerrar sesión
          </motion.button>
        </div>
      </header>

      <main className="flex flex-1 flex-col bg-gray-900 overflow-x-hidden">
        <div className="mx-auto w-full flex-1 px-4 py-12 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl bg-gray-800 border border-gray-700 p-6 mb-8 shadow-md"
          >
            <h2 className="text-xl font-bold text-white mb-4">Tus eventos</h2>
            <EventSelector
              selectedEventId={selectedEventId}
              onSelect={setSelectedEventId}
            />
          </motion.div>

          <div className="mt-10 mb-8">
            <DashboardActions
              onCreateEvent={() => setIsEventModalOpen(true)}
              onCreatePhase={() => setIsPhaseModalOpen(true)}
              onCreatePromoter={() => setIsPromoterModalOpen(true)}
              onCreateLocality={() => setIsLocalityModalOpen(true)}
              onCreateTicketType={() => setIsTicketTypeModalOpen(true)} // ✅ agregado
              onRegisterTicket={() => setIsTicketModalOpen(true)}
              isEventSelected={!!selectedEventId} // ✅ agregado
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="bg-gray-800 border border-gray-700 p-6 rounded-2xl shadow-md"
          >
            <h2 className="text-xl font-bold text-white mb-4">Boletas</h2>
            {selectedEventId ? (
              <TicketsTable eventId={selectedEventId} />
            ) : (
              <p className="text-white/70 text-center py-4">
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
      <PhaseModal
        isOpen={isPhaseModalOpen}
        onClose={() => setIsPhaseModalOpen(false)}
        eventId={selectedEventId || ""}
      />
      <PromoterModal
        isOpen={isPromoterModalOpen}
        onClose={() => setIsPromoterModalOpen(false)}
        eventId={selectedEventId || ""}
      />
      <TicketTypeModal
        isOpen={isTicketTypeModalOpen}
        onClose={() => setIsTicketTypeModalOpen(false)}
        eventId={selectedEventId || ""}
      />
      <LocalityModal
        isOpen={isLocalityModalOpen}
        onClose={() => setIsLocalityModalOpen(false)}
        eventId={selectedEventId || ""}
      />
    </section>
  );
};

export default DashboardPage;
