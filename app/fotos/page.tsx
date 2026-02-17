"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";

type FotoItem = {
  id: number;
  url: string;
  descricao?: string;
};

export default function Fotos() {
  // Mock inicial de fotos (pode substituir futuramente pelo Firebase)
  const [fotos, setFotos] = useState<FotoItem[]>([
    { id: 1, url: "/placeholder.png", descricao: "Antes" },
    { id: 2, url: "/placeholder.png", descricao: "Depois" },
  ]);

  return (
    <div className="min-h-screen bg-zinc-900">
      <Navbar />

      <main className="flex flex-col items-center justify-start pt-28 p-4 space-y-6 w-full max-w-5xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-white text-center">
          📸 Fotos Antes / Depois
        </h1>
        {/* <p className="text-sm text-zinc-400 text-center">
          Dica: futuramente você poderá fazer upload de fotos usando Firebase.
        </p> */}

        {/* Grid de fotos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
          {fotos.map((foto) => (
            <div
              key={foto.id}
              className="bg-zinc-800 rounded-xl overflow-hidden shadow-md flex flex-col"
            >
              <img
                src={foto.url}
                alt={foto.descricao}
                className="w-full h-48 object-cover"
              />
              {foto.descricao && (
                <div className="p-2 text-white text-center font-semibold">
                  {foto.descricao}
                </div>
              )}
              <div className="flex justify-between p-2 text-sm">
                <button className="text-yellow-400 hover:underline cursor-pointer">
                  Editar
                </button>
                <button className="text-red-500 hover:underline cursor-pointer">
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Botão para adicionar foto (futuro upload) */}
        <button className="mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl shadow-md transition transform hover:scale-105 cursor-pointer">
          Adicionar Foto
        </button>
      </main>
    </div>
  );
}
