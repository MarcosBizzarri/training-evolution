"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
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

  // ✅ Inicializa com data de hoje
  const hoje = new Date();
  const dataHoje = hoje.toISOString().split("T")[0];
  const [dataSelecionada, setDataSelecionada] = useState(dataHoje);

  // -----------------------------
  // MONITORAR USUÁRIO
  // -----------------------------
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/login");
      } else {
        setUser(currentUser);
      }
    });

    return () => unsubscribe();
  }, [router]);

  // -----------------------------
  // BUSCAR TIPOS PERSONALIZADOS
  // -----------------------------
  useEffect(() => {
    if (!user) return;

    const tiposRef = collection(db, "users", user.uid, "tipos");

    const unsub = onSnapshot(tiposRef, (snapshot) => {
      const listaTipos = snapshot.docs.map(
        (doc) => doc.data().nome as string
      );

      setTipos([
        "Academia",
        "Corrida",
        "Caminhada",
        "Bike",
        ...listaTipos,
      ]);
    });

    return () => unsub();
  }, [user]);

  // -----------------------------
  // BUSCAR CHECKINS
  // -----------------------------
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

  // -----------------------------
  // ADICIONAR TIPO
  // -----------------------------
  const adicionarTipo = async () => {
    if (!novoTipo.trim() || !user) return;

    if (tipos.includes(novoTipo)) {
      alert("Tipo já existe!");
      return;
    }

    await addDoc(collection(db, "users", user.uid, "tipos"), {
      nome: novoTipo,
    });

    setNovoTipo("");
  };

  // -----------------------------
  // SALVAR CHECKIN
  // -----------------------------
  const salvarCheckin = async (tipo: string) => {
    if (!user) return;

    const data = Timestamp.fromDate(new Date(dataSelecionada));

    await addDoc(collection(db, "users", user.uid, "checkins"), {
      tipo,
      data,
      comentario,
    });

    setComentario("");
  };

  // -----------------------------
  // EDITAR CHECKIN
  // -----------------------------
  const editarCheckin = async (
    id: string,
    oldTipo: string,
    oldComentario: string
  ) => {
    if (!user) return;

    const novoTipoPrompt =
      prompt("Editar tipo de treino:", oldTipo) || oldTipo;

    const novoComentario =
      prompt("Editar comentário:", oldComentario) || oldComentario;

    await updateDoc(doc(db, "users", user.uid, "checkins", id), {
      tipo: novoTipoPrompt,
      comentario: novoComentario,
    });
  };

  // -----------------------------
  // EXCLUIR CHECKIN
  // -----------------------------
  const excluirCheckin = async (id: string) => {
    if (!user) return;

    if (!confirm("Deseja excluir este check-in?")) return;

    await deleteDoc(doc(db, "users", user.uid, "checkins", id));
  };

  // -----------------------------
  // LOADING
  // -----------------------------
  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-900 text-white">
        Carregando...
      </div>
    );

  return (
    <div className="min-h-screen bg-zinc-900">
      <Navbar />

      <main className="flex flex-col items-center pt-28 p-4 space-y-6 w-full max-w-xl mx-auto">
        <h1 className="text-3xl font-bold text-white">Treinos</h1>

        {/* FORM */}
        <div className="flex flex-col space-y-4 w-full">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="date"
              value={dataSelecionada}
              onChange={(e) => setDataSelecionada(e.target.value)}
              className="flex-1 p-3 rounded-lg bg-gray-100"
            />

            <input
              type="text"
              placeholder="Comentário"
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              className="flex-1 p-3 rounded-lg bg-gray-100"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {tipos.map((tipo) => (
              <button
                key={tipo}
                onClick={() => salvarCheckin(tipo)}
                className="bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl transition"
              >
                {tipo}
              </button>
            ))}
          </div>
        </div>

        {/* HISTÓRICO */}
        <div className="w-full">
          <h2 className="text-white font-bold mb-2">📅 Histórico</h2>

          {checkins.length === 0 ? (
            <p className="text-zinc-400">Nenhum treino ainda</p>
          ) : (
            <ul className="space-y-3">
              {checkins.map((item) => (
                <li
                  key={item.id}
                  className="bg-zinc-800 p-4 rounded-lg"
                >
                  <div className="flex justify-between text-white">
                    <span>{item.tipo}</span>
                    <span className="text-sm text-zinc-400">
                      {item.data
                        .toDate()
                        .toLocaleDateString("pt-BR")}
                    </span>
                  </div>

                  {item.comentario && (
                    <p className="text-sm text-zinc-300 mt-1">
                      {item.comentario}
                    </p>
                  )}

                  <div className="flex gap-4 mt-2">
                    <button
                      onClick={() =>
                        editarCheckin(
                          item.id,
                          item.tipo,
                          item.comentario || ""
                        )
                      }
                      className="text-yellow-400 text-sm"
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => excluirCheckin(item.id)}
                      className="text-red-500 text-sm"
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
