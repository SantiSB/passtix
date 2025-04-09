// app/login/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";

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
    } catch (err: any) {
      setError("Correo o contraseña incorrectos.");
    }
  };

  if (loading) return <p className="p-4">Cargando...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-white">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md space-y-6"
      >
        <h1 className="text-2xl font-bold text-center text-gray-900">
          Iniciar sesión
        </h1>

        {error && <p className="text-red-600 text-sm text-center">{error}</p>}

        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-3 border border-gray-300 rounded-md"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-3 border border-gray-300 rounded-md"
        />

        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800"
        >
          Ingresar
        </button>
      </form>
    </div>
  );
}
