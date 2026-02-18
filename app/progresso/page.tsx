"use client";

import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  Timestamp,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import Navbar from "../components/Navbar";

type PesoItem = {
  id: string;
  valor: number;
  comentario?: string;
  data: Timestamp;
};

export default function Progresso() {
  const [user, setUser] = useState<User | null>(null);
  const [peso, setPeso] = useState("");
  const [comentario, setComentario] = useState("");

  // Estado da data selecionada
  
// Estado da data selecionada, inicializado de forma segura no cliente
const [dataSelecionada, setDataSelecionada] = useState<string>(() => {
  if (typeof window !== "undefined") {
    const dataSalva = localStorage.getItem("dataSelecionadaPeso");
    if (dataSalva) return dataSalva;
  }

  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const dia = String(hoje.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
});


  const [historico, setHistorico] = useState<PesoItem[]>([]);

  // Monitorar usuário logado
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Buscar histórico
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "users", user.uid, "peso"),
      orderBy("data", "desc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as PesoItem[];
      setHistorico(lista);
    });

    return () => unsub();
  }, [user]);

  // Função para criar Timestamp a partir da data selecionada (corrige fuso horário)
  const criarTimestampLocal = (dataStr: string) => {
    const [ano, mes, dia] = dataStr.split("-").map(Number);
    const dataLocal = new Date(ano, mes - 1, dia); // horário local
    return Timestamp.fromDate(dataLocal);
  };

  // Salvar peso
  async function salvar() {
    if (!user) {
      alert("Usuário não logado");
      return;
    }
    if (!peso) {
      alert("Informe o peso");
      return;
    }

    await addDoc(collection(db, "users", user.uid, "peso"), {
      valor: Number(peso),
      comentario: comentario || "",
      data: criarTimestampLocal(dataSelecionada),
    });

    setPeso("");
    setComentario("");

    // Resetar para hoje
    const hoje = new Date();
    const anoHoje = hoje.getFullYear();
    const mesHoje = String(hoje.getMonth() + 1).padStart(2, "0");
    const diaHoje = String(hoje.getDate()).padStart(2, "0");
    setDataSelecionada(`${anoHoje}-${mesHoje}-${diaHoje}`);
  }

  // Editar registro
  async function editar(item: PesoItem) {
    const novoValor = prompt("Editar peso:", item.valor.toString());
    const novoComentario = prompt("Editar comentário:", item.comentario || "");
    const novaDataStr = prompt(
      "Editar data (YYYY-MM-DD):",
      item.data.toDate().toISOString().split("T")[0]
    );

    if (!novoValor || !user || !novaDataStr) return;

    await updateDoc(doc(db, "users", user.uid, "peso", item.id), {
      valor: Number(novoValor),
      comentario: novoComentario || "",
      data: criarTimestampLocal(novaDataStr),
    });
  }

  // Excluir registro
  async function excluir(item: PesoItem) {
    if (!user) return;
    if (!confirm("Deseja realmente excluir este registro?")) return;

    await deleteDoc(doc(db, "users", user.uid, "peso", item.id));
  }

  return (
    <div className="min-h-screen bg-zinc-900">
      <Navbar />

      <main className="flex flex-col items-center justify-start pt-28 p-4 space-y-6 w-full max-w-md mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-white text-center">
          Peso
        </h1>

        {/* Form para adicionar peso */}
        <div className="flex flex-col space-y-4 w-full">
          <input
            type="number"
            step="0.1"
            placeholder="Ex: 82.5"
            value={peso}
            onChange={(e) => setPeso(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="text"
            placeholder="Comentário (opcional)"
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="date"
            value={dataSelecionada}
            onChange={(e) => setDataSelecionada(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            onClick={salvar}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl shadow-md transition transform hover:scale-105 cursor-pointer"
          >
            Salvar Peso
          </button>
        </div>

        {/* Histórico */}
        <div className="w-full space-y-3 mt-6">
          <h2 className="text-white font-bold text-lg sm:text-xl text-center">
            📅 Histórico
          </h2>

          {historico.length === 0 ? (
            <p className="text-center text-zinc-400">Nenhum registro ainda</p>
          ) : (
            <ul className="space-y-3">
              {historico.map((item) => (
                <li
                  key={item.id}
                  className="bg-zinc-800 p-4 rounded-lg flex flex-col space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-white font-semibold">
                      {item.valor} kg
                    </span>
                    <span className="text-sm text-zinc-400">
                      {item.data.toDate().toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                  {item.comentario && (
                    <p className="text-sm text-zinc-300">{item.comentario}</p>
                  )}
                  <div className="flex gap-3 mt-2">
                    <button
                      onClick={() => editar(item)}
                      className="text-yellow-400 text-sm hover:underline cursor-pointer"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => excluir(item)}
                      className="text-red-500 text-sm hover:underline cursor-pointer"
                    >
                      Excluir
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
