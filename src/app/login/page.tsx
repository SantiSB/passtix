"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";
import { motion } from "framer-motion";
import Image from "next/image";

export default function LoginPage() {
  const { user, login, loading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) router.push("/dashboard");
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
    } catch {
      setError("Correo o contraseña incorrectos.");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-gray-300">
        Cargando...
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 px-4 text-white">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-gray-900 border border-gray-700 rounded-2xl shadow-xl p-8"
      >
        <div className="flex justify-center mb-6">
          <Image
            src="/branding/ImagotipoBlanco.png"
            alt="PassTix Logo"
            width={120}
            height={120}
          />
        </div>

        <h1 className="text-2xl font-bold text-center mb-6">Iniciar sesión</h1>

        {error && (
          <p className="text-red-400 text-sm text-center bg-red-900/30 px-4 py-2 rounded-md mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <button
            type="submit"
            className="w-full bg-amber-400 text-black font-semibold py-3 rounded-xl hover:scale-105 transition-transform"
          >
            Ingresar
          </button>
        </form>
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
}
