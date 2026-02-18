"use client";

import Link from "next/link";
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <>
      {/* Navbar fixa no topo */}
      <Navbar />

      <main className="flex flex-col items-center justify-start min-h-screen p-4 pt-28 bg-zinc-900 space-y-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-white text-center">
          Treinos Diários
        </h1>

        <div className="w-full max-w-md flex flex-col space-y-4">
          <Link
            href="/checkin"
            className="block bg-green-600 hover:bg-green-700 text-white py-4 px-6 rounded-xl text-center font-semibold transition"
          >
            Novo Treino
          </Link>

          <Link
            href="/progresso"
            className="block bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-xl text-center font-semibold transition"
          >
            Peso & Progresso
          </Link>

          <Link
            href="/fotos"
            className="block bg-purple-600 hover:bg-purple-700 text-white py-4 px-6 rounded-xl text-center font-semibold transition"
          >
            Fotos Antes / Depois
          </Link>
        </div>
      </main>
    </>
  );
}
