"use client";

import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function Navbar() {
  const router = useRouter();

  // Função de logout
  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-zinc-800 p-4 shadow-md z-50">
      <div className="flex justify-between items-center max-w-5xl mx-auto">
  <button
    onClick={() => router.push("/")}
    className="text-white font-bold text-2xl hover:text-blue-400 transition cursor-pointer"
  >
    Início
  </button>

  <button
    onClick={handleLogout}
    className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-xl shadow-md transition transform hover:scale-105 cursor-pointer"
  >
    Sair
  </button>
</div>

    </nav>
  );
}
