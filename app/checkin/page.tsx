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
  orderBy,
  query,
  Timestamp,
  limit,
  startAfter,
  getDocs,
  QueryDocumentSnapshot,
  DocumentData,
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
  const [todosCheckins, setTodosCheckins] = useState<Checkin[]>([]);
  const [lastDoc, setLastDoc] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null);

  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // MODAL
  const [modalAberto, setModalAberto] = useState(false);
  const [checkinEditando, setCheckinEditando] = useState<Checkin | null>(null);
  const [novoTipo, setNovoTipo] = useState("");
  const [novoComentario, setNovoComentario] = useState("");

  const [tipos] = useState<string[]>([
    "Academia",
    "Corrida",
    "Caminhada",
    "Bike",
  ]);

  const [comentario, setComentario] = useState("");

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const dataHoje = hoje.toISOString().split("T")[0];
  const [dataSelecionada, setDataSelecionada] = useState(dataHoje);

  // ---------------- AUTH ----------------
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

  // ---------------- BUSCAR TODOS ----------------
  useEffect(() => {
    if (!user) return;

    const buscarTodos = async () => {
      const q = query(
        collection(db, "users", user.uid, "checkins"),
        orderBy("data", "desc"),
      );

      const snapshot = await getDocs(q);

      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Checkin[];

      setTodosCheckins(lista);
    };

    buscarTodos();
  }, [user]);

  // ---------------- BUSCAR PRIMEIROS ----------------
  const buscarPrimeiros = async () => {
    if (!user) return;

    const q = query(
      collection(db, "users", user.uid, "checkins"),
      orderBy("data", "desc"),
      limit(5),
    );

    const snapshot = await getDocs(q);

    const lista = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Checkin[];

    setCheckins(lista);
    setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
    setHasMore(snapshot.docs.length === 5);
  };

  useEffect(() => {
    if (!user) return;

    const buscarPrimeiros = async () => {
      const q = query(
        collection(db, "users", user.uid, "checkins"),
        orderBy("data", "desc"),
        limit(5),
      );

      const snapshot = await getDocs(q);

      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Checkin[];

      setCheckins(lista);
      setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
      setHasMore(snapshot.docs.length === 5);
    };

    buscarPrimeiros();
  }, [user]);

  // ---------------- VER MAIS ----------------
  const carregarMais = async () => {
    if (!user || !lastDoc) return;

    setLoadingMore(true);

    const q = query(
      collection(db, "users", user.uid, "checkins"),
      orderBy("data", "desc"),
      startAfter(lastDoc),
      limit(5),
    );

    const snapshot = await getDocs(q);

    const novos = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Checkin[];

    setCheckins((prev) => [...prev, ...novos]);
    setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
    setHasMore(snapshot.docs.length === 5);

    setLoadingMore(false);
  };

  // ---------------- SALVAR NOVO ----------------
  // ---------------- SALVAR OU ATUALIZAR ----------------
  const salvarCheckin = async (tipo: string) => {
    if (!user) return;

    const [ano, mes, dia] = dataSelecionada.split("-").map(Number);
    const dataLocal = new Date(ano, mes - 1, dia, 12, 0, 0);
    const data = Timestamp.fromDate(dataLocal);

    // 🔎 Verifica se já existe treino nesse dia
    const q = query(
      collection(db, "users", user.uid, "checkins"),
      orderBy("data", "desc"),
    );

    const snapshot = await getDocs(q);

    const checkinExistente = snapshot.docs.find((doc) => {
      const dataDoc = doc.data().data.toDate();
      return dataDoc.toDateString() === dataLocal.toDateString();
    });

    if (checkinExistente) {
      // ✅ Atualiza o que já existe
      await updateDoc(
        doc(db, "users", user.uid, "checkins", checkinExistente.id),
        {
          tipo,
          comentario,
        },
      );
    } else {
      // ✅ Cria novo se não existir
      await addDoc(collection(db, "users", user.uid, "checkins"), {
        tipo,
        data,
        comentario,
      });
    }

    setComentario("");
    buscarPrimeiros();
  };

  // ---------------- EXCLUIR ----------------
  const excluirCheckin = async (id: string) => {
    if (!user) return;

    await deleteDoc(doc(db, "users", user.uid, "checkins", id));
    buscarPrimeiros();
  };

  const buscarTodos = async () => {
    if (!user) return;

    const q = query(
      collection(db, "users", user.uid, "checkins"),
      orderBy("data", "desc"),
    );

    const snapshot = await getDocs(q);

    const lista = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Checkin[];

    setTodosCheckins(lista);
  };

  useEffect(() => {
    if (!user) return;

    const buscarTodos = async () => {
      const q = query(
        collection(db, "users", user.uid, "checkins"),
        orderBy("data", "desc"),
      );

      const snapshot = await getDocs(q);

      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Checkin[];

      setTodosCheckins(lista);
    };

    buscarTodos();
  }, [user]);

  // ---------------- CONTADORES ----------------
  const diasUnicos = new Set(
    todosCheckins.map((c) => c.data.toDate().toDateString()),
  );

  const totalDiasTreinados = diasUnicos.size;

  const datasOrdenadas = [...diasUnicos]
    .map((d) => new Date(d))
    .sort((a, b) => b.getTime() - a.getTime());

  let streak = 0;

  // Normaliza datas
  const datasNormalizadas = datasOrdenadas.map((d) => {
    const nova = new Date(d);
    nova.setHours(0, 0, 0, 0);
    return nova;
  });

  // Verifica se treinou hoje
  const treinouHoje =
    datasNormalizadas.length > 0 &&
    datasNormalizadas[0].getTime() === hoje.getTime();

  // Se treinou hoje começa do 0, se não começa do 1 (ontem)
  let offset = treinouHoje ? 0 : 1;

  for (let i = 0; i < datasNormalizadas.length; i++) {
    const data = new Date(hoje);
    data.setDate(hoje.getDate() - offset);

    if (datasNormalizadas.some((d) => d.getTime() === data.getTime())) {
      streak++;
      offset++;
    } else {
      break;
    }
  }

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-900 text-white">
        Carregando...
      </div>
    );

  return (
    <div className="min-h-screen w-full bg-zinc-900">
      <Navbar />

      <main className="pt-24 px-4 pb-10 w-full max-w-md mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-white text-center">Treinos</h1>

        <p className="text-green-400 font-semibold">
          🔥 {totalDiasTreinados} dias treinando
        </p>

        <p className="text-orange-400 font-semibold">
          ⚡ {streak} dias seguidos
        </p>

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
                className="bg-blue-600 hover:bg-blue-700 active:scale-95 
                text-white py-3 rounded-2xl font-semibold shadow-md 
                transition-all duration-200 cursor-pointer"
              >
                {tipo}
              </button>
            ))}
          </div>
        </div>

        {/* HISTÓRICO */}
        <div>
          <h2 className="text-white font-bold mb-2">📅 Histórico</h2>

          <ul className="space-y-3">
            {checkins.map((item) => (
              <li
                key={item.id}
                className="bg-zinc-800 p-4 rounded-2xl border border-zinc-700"
              >
                <div className="flex justify-between text-white">
                  <span>{item.tipo}</span>
                  <span className="text-sm text-zinc-400">
                    {item.data.toDate().toLocaleDateString("pt-BR")}
                  </span>
                </div>

                {item.comentario && (
                  <p className="text-sm text-zinc-300 mt-1">
                    {item.comentario}
                  </p>
                )}

                <div className="flex gap-4 mt-3 text-sm">
                  <button
                    onClick={() => {
                      setCheckinEditando(item);
                      setNovoTipo(item.tipo);
                      setNovoComentario(item.comentario || "");
                      setModalAberto(true);
                    }}
                    className="text-yellow-400 cursor-pointer"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => excluirCheckin(item.id)}
                    className="text-red-500 cursor-pointer"
                  >
                    Excluir
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {hasMore && (
            <button
              onClick={carregarMais}
              disabled={loadingMore}
              className="w-full mt-4 bg-zinc-700 hover:bg-zinc-600 
               text-white py-2 rounded-lg transition cursor-pointer"
            >
              {loadingMore ? "Carregando..." : "Ver mais"}
            </button>
          )}
        </div>

        {/* MODAL */}
        {modalAberto && checkinEditando && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-zinc-900 p-6 rounded-2xl w-80 space-y-4 border border-zinc-700">
              <h2 className="text-xl font-bold text-white">Atualizar Treino</h2>

              <input
                type="text"
                placeholder="Digite o treino"
                value={novoTipo}
                onChange={(e) => setNovoTipo(e.target.value)}
                className="w-full p-3 rounded-lg bg-zinc-800 text-white"
              />

              <div className="flex flex-wrap gap-2">
                {tipos.map((tipo) => (
                  <button
                    key={tipo}
                    type="button"
                    onClick={() => setNovoTipo(tipo)}
                    className="px-3 py-1 bg-zinc-700 rounded-lg text-sm text-white hover:bg-zinc-600 transition cursor-pointer"
                  >
                    {tipo}
                  </button>
                ))}
              </div>

              <input
                type="text"
                value={novoComentario}
                onChange={(e) => setNovoComentario(e.target.value)}
                className="w-full p-3 rounded-lg bg-zinc-800 text-white"
              />

              <div className="flex justify-between">
                <button
                  onClick={() => setModalAberto(false)}
                  className="bg-red-500 px-4 py-2 rounded-lg cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  onClick={async () => {
                    if (!user) return;

                    await updateDoc(
                      doc(
                        db,
                        "users",
                        user.uid,
                        "checkins",
                        checkinEditando.id,
                      ),
                      {
                        tipo: novoTipo,
                        comentario: novoComentario,
                      },
                    );

                    setModalAberto(false);
                    await buscarPrimeiros();
                    await buscarTodos();
                  }}
                  className="bg-blue-600 px-4 py-2 rounded-lg cursor-pointer"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
