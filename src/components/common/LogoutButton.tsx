// components/LogoutButton.tsx
"use client";
import useAuth from "@/hooks/useAuth";

const LogoutButton = () => {
  const { logout } = useAuth();

  return (
    <button
      onClick={logout}
      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
    >
      Cerrar sesión
    </button>
  );
};

export default LogoutButton;
