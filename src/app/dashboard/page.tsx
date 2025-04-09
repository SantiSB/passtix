"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext"; // 👈 nuevo hook desde context
import TicketsTable from "@/components/TicketsTable";
import TicketModal from "@/components/TicketModal";

const DashboardPage = () => {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-gray-500">
        Cargando sesión...
      </div>
    );
  }

  if (!user) return null;

  return (
    <section className="min-h-screen w-full flex flex-col bg-gradient-to-br from-gray-100 to-white">
      {/* Barra superior */}
      <header className="sticky top-0 z-20 bg-black/90 backdrop-blur-md shadow-lg">
        <div className="mx-auto flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            PassTix <span className="text-gray-300">Dashboard</span>
          </h1>

          <div className="flex items-center gap-4">
            <button
              onClick={openModal}
              className="inline-flex items-center gap-2 rounded-lg bg-amber-400 px-4 py-2 text-sm font-medium text-black shadow-lg transition transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
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
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="flex flex-1 flex-col">
        <div className="mx-auto w-full flex-1 px-4 py-10 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm ring-1 ring-gray-100">
            <div className="overflow-x-auto w-full">
              <TicketsTable />
            </div>
          </div>
        </div>
      </main>

      <TicketModal mode="create" isOpen={isModalOpen} onClose={closeModal} />
    </section>
  );
};

export default DashboardPage;
