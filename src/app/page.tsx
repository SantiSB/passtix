"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
const HomePage: React.FC = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-white flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <Image
          src="/branding/ImagotipoBlanco.png"
          alt="PassTix Logo"
          className="mb-16"
          width={500}
          height={500}
        />
        <p className="text-md text-gray-300 mb-8 mx-auto">
         Gestiona tus entradas para eventos de forma fácil, rápida y
          segura.
        </p>
        <button
          className="px-6 py-3 text-lg font-semibold rounded-2xl shadow-xl bg-amber-400 text-black hover:scale-105 transition-transform"
          onClick={() => router.push("/login")}
        >
          Iniciar sesión
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="absolute bottom-6 text-xs text-gray-500"
      >
        © 2025 PassTix. Todos los derechos reservados.
      </motion.div>
    </div>
  );
};

export default HomePage;
