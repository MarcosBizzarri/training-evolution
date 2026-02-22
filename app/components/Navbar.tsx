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
   <nav className="fixed top-0 left-0 w-full bg-zinc-900 shadow-md z-50">
  <div className="flex justify-between items-center px-4 py-3">
    
    <button
      onClick={() => router.push("/app")}
      className="text-white font-bold text-lg hover:text-blue-400 transition"
    >
      Início
    </button>

    <button
      onClick={handleLogout}
      className="bg-red-500 hover:bg-red-600 active:scale-95 
                 text-white text-sm font-semibold 
                 px-4 py-2 rounded-xl 
                 transition-all duration-200"
    >
      Sair
    </button>

  </div>
</nav>
  );
}
