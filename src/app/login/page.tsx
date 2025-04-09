"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";

const LoginPage: React.FC = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-white flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-sm text-center"
      >
        <div className="flex justify-center mb-12">
          <Image
            src="/branding/IsotipoClaro.png"
            alt="PassTix Logo"
            width={250}
            height={250}
          />
        </div>
        <h2 className="text-2xl font-bold mb-6">Inicia sesión en tu cuenta</h2>
        <form className="space-y-4 text-left">
          <div>
            <label htmlFor="email" className="block text-sm mb-1 text-gray-300">
              Correo electrónico
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
              placeholder="tucorreo@email.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm mb-1 text-gray-300">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-lg font-semibold rounded-2xl shadow-xl bg-amber-400 text-black hover:scale-105 transition-transform"
          >
            Entrar
          </button>
        </form>
        <button
          onClick={() => router.push("/")}
          className="mt-6 text-sm text-gray-400 hover:text-white hover:underline"
        >
          ← Volver al inicio
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

export default LoginPage;