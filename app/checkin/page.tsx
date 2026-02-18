"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  doc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";

type Checkin = {
  id: string;
  tipo: string;
  data: Timestamp;
  comentario?: string;
};

export default function CheckinPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [checkins, setCheckins] = useState<Checkin[]>([]);
  const [tipos, setTipos] = useState<string[]>([
    "Academia",
    "Corrida",
    "Caminhada",
    "Bike",
  ]);

  const [novoTipo, setNovoTipo] = useState("");
  const [comentario, setComentario] = useState("");

  // Inicializa dataSelecionada com localStorage ou hoje
  const [dataSelecionada, setDataSelecionada] = useState(() => {
    const dataSalva = localStorage.getItem("dataSelecionada");
    if (dataSalva) return dataSalva;

    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const dia = String(hoje.getDate()).padStart(2, "0");
    return `${ano}-${mes}-${dia}`;
  });

  // Salva dataSelecionada no localStorage sempre que muda
  useEffect(() => {
    localStorage.setItem("dataSelecionada", dataSelecionada);
  }, [dataSelecionada]);

  // Monitorar login
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) router.push("/login");
    });
    return () => unsubscribe();
  }, [router]);

  // Buscar tipos adicionais do Firestore
  useEffect(() => {
    if (!user) return;
    const tiposRef = collection(db, "users", user.uid, "tipos");
    const unsub = onSnapshot(tiposRef, (snapshot) => {
      const listaTipos = snapshot.docs.map((doc) => doc.data().nome);
      setTipos((prev) => [
        ...["Academia", "Corrida", "Caminhada", "Bike"],
        ...listaTipos.filter((t) => !prev.includes(t)),
      ]);
    });
    return () => unsub();
  }, [user]);

  // Adicionar novo tipo
  const adicionarTipo = async () => {
    if (!novoTipo) return;
    if (tipos.includes(novoTipo)) {
      alert("Tipo já existe!");
      return;
    }
    if (!user) return;

    const tiposRef = collection(db, "users", user.uid, "tipos");
    await addDoc(tiposRef, { nome: novoTipo });
    setNovoTipo("");
  };

  // Salvar check-in
  const salvarCheckin = async (tipo: string) => {
    if (!user) return;

    // Criar Date no horário local a partir de dataSelecionada
    const [ano, mes, dia] = dataSelecionada.split("-").map(Number);
    const dataLocal = new Date(ano, mes - 1, dia);

    // Criar Timestamp do Firestore
    const timestampData = Timestamp.fromDate(dataLocal);

    await addDoc(collection(db, "users", user.uid, "checkins"), {
      tipo,
      data: timestampData,
      comentario: comentario || "",
    });

    // Resetar comentário
    setComentario("");

    // Resetar dataSelecionada para hoje
    const hoje = new Date();
    const anoHoje = hoje.getFullYear();
    const mesHoje = String(hoje.getMonth() + 1).padStart(2, "0");
    const diaHoje = String(hoje.getDate()).padStart(2, "0");
    setDataSelecionada(`${anoHoje}-${mesHoje}-${diaHoje}`);
  };

  // Editar check-in
  const editarCheckin = async (
    id: string,
    oldTipo: string,
    oldComentario: string
  ) => {
    const novoTipo = prompt("Editar tipo de treino:", oldTipo) || oldTipo;
    const novoComentario =
      prompt("Editar comentário:", oldComentario) || oldComentario;

    if (!user) return;

    await updateDoc(doc(db, "users", user.uid, "checkins", id), {
      tipo: novoTipo,
      comentario: novoComentario,
    });
  };

  // Excluir check-in
  const excluirCheckin = async (id: string) => {
    if (!user) return;
    if (!confirm("Deseja realmente excluir este check-in?")) return;
    await deleteDoc(doc(db, "users", user.uid, "checkins", id));
  };

  // Buscar check-ins
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "users", user.uid, "checkins"),
      orderBy("data", "desc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Checkin[];
      setCheckins(lista);
    });

    return () => unsub();
  }, [user]);

  return (
    <div className="min-h-screen bg-zinc-900">
      <Navbar />
      <main className="flex flex-col items-center pt-28 p-4 space-y-6 w-full max-w-xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-white text-center">
          Treinos
        </h1>

        {/* Form de check-in */}
        <div className="flex flex-col space-y-4 w-full">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="date"
              value={dataSelecionada}
              onChange={(e) => setDataSelecionada(e.target.value)}
              className="flex-1 p-3 rounded-lg border border-gray-300 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="text"
              placeholder="Comentário (opcional)"
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              className="flex-1 p-3 rounded-lg border border-gray-300 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Lista de tipos */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {tipos.map((tipo) => (
              <button
                key={tipo}
                onClick={() => salvarCheckin(tipo)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl shadow-md transition transform hover:scale-105 cursor-pointer"
              >
                {tipo}
              </button>
            ))}
          </div>

          {/* Adicionar novo tipo */}
          <div className="flex flex-col sm:flex-row gap-3 mt-3">
            <input
              type="text"
              placeholder="Adicionar novo tipo de esporte"
              value={novoTipo}
              onChange={(e) => setNovoTipo(e.target.value)}
              className="flex-1 p-3 rounded-lg border border-gray-300 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <button
              onClick={adicionarTipo}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl shadow-md transition transform hover:scale-105 cursor-pointer"
            >
              Adicionar
            </button>
          </div>
        </div>

        {/* Histórico */}
        <div className="w-full">
          <h2 className="font-bold text-lg sm:text-xl text-white mb-2">
            📅 Histórico
          </h2>

          {checkins.length === 0 ? (
            <p className="text-center text-zinc-400 text-sm">
              Nenhum treino ainda
            </p>
          ) : (
            <ul className="space-y-3">
              {checkins.map((item) => (
                <li
                  key={item.id}
                  className="bg-zinc-800 p-4 rounded-lg flex flex-col space-y-2"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <span className="font-semibold text-white">{item.tipo}</span>
                    <span className="text-sm text-zinc-400 mt-1 sm:mt-0">
                      {item.data.toDate().toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                  {item.comentario && (
                    <p className="text-sm text-zinc-300">{item.comentario}</p>
                  )}
                  <div className="flex gap-3 mt-2">
                    <button
                      onClick={() =>
                        editarCheckin(item.id, item.tipo, item.comentario || "")
                      }
                      className="text-yellow-400 text-sm hover:underline cursor-pointer"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => excluirCheckin(item.id)}
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
