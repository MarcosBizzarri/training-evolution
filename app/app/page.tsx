"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { auth, db } from "@/lib/firebase";
import { Dumbbell, Camera, Activity, Edit2, Check } from "lucide-react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  updateDoc,
  addDoc,
} from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import Link from "next/link";
import {
  Timestamp,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";

// Tipagem do checkin
type Checkin = {
  id: string;
  tipo: string;
  data: Timestamp;
  comentario?: string;
  peso?: number;
  foto?: string;
};

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [checkins, setCheckins] = useState<Checkin[]>([]);
  const [pesoAtual, setPesoAtual] = useState<number>(0);
  const [pesoMeta, setPesoMeta] = useState<number>(72);
  const [novoPesoMeta, setNovoPesoMeta] = useState<number>(72);
  const [editandoMeta, setEditandoMeta] = useState(false);
  const [loading, setLoading] = useState(true);

  // ---------------- AUTH ----------------
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) return;
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // ---------------- BUSCAR CHECKINS E PESO ----------------
  useEffect(() => {
    if (!user) return;

    const fetchDados = async () => {
      try {
        // 1️⃣ Checkins
        const qCheckins = query(
          collection(db, "users", user.uid, "checkins"),
          orderBy("data", "desc"),
        );
        const snapshotCheckins = await getDocs(qCheckins);

        const listaCheckins: Checkin[] = snapshotCheckins.docs.map(
          (doc: QueryDocumentSnapshot<DocumentData>) => {
            const data = doc.data() as Omit<Checkin, "id">;
            return {
              id: doc.id,
              ...data,
            };
          },
        );
        setCheckins(listaCheckins);

        // 2️⃣ Peso atual (último registro da coleção "peso")
        const qPeso = query(
          collection(db, "users", user.uid, "peso"),
          orderBy("data", "desc"),
        );
        const snapshotPeso = await getDocs(qPeso);
        if (!snapshotPeso.empty) {
          const ultimoPeso = snapshotPeso.docs[0].data() as { valor: number };
          setPesoAtual(ultimoPeso.valor);
        }

        // 3️⃣ Peso meta
        const metaSnapshot = await getDocs(
          collection(db, "users", user.uid, "meta"),
        );
        if (!metaSnapshot.empty) {
          const metaData = metaSnapshot.docs[0].data() as { pesoMeta?: number };
          if (metaData.pesoMeta) {
            setPesoMeta(metaData.pesoMeta);
            setNovoPesoMeta(metaData.pesoMeta);
          }
        }
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDados();
  }, [user]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-900 text-white">
        Carregando...
      </div>
    );

  // ---------------- RESUMO ----------------
  const treinosFeitos = checkins.length;

  // Hoje
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  // Domingo da semana atual
  const diaDaSemana = hoje.getDay();
  const domingo = new Date(hoje);
  domingo.setDate(hoje.getDate() - diaDaSemana);
  domingo.setHours(0, 0, 0, 0);

  // Dias da semana até hoje
  const diasSemana: string[] = [];
  for (let i = 0; i <= diaDaSemana; i++) {
    const dia = new Date(domingo);
    dia.setDate(domingo.getDate() + i);
    diasSemana.push(dia.toDateString());
  }

  const treinosSemana = diasSemana.filter((diaStr) =>
    checkins.some((c) => c.data.toDate().toDateString() === diaStr),
  ).length;

  const fotosEnviadas = checkins.filter((c) => c.foto).length;
  const fotosTotal = checkins.length;

  // ---------------- SALVAR PESO META ----------------
  const salvarPesoMeta = async () => {
    if (!user) return;

    try {
      const metaCollection = collection(db, "users", user.uid, "meta");
      const snapshot = await getDocs(metaCollection);

      if (!snapshot.empty) {
        await updateDoc(
          doc(db, "users", user.uid, "meta", snapshot.docs[0].id),
          {
            pesoMeta: novoPesoMeta,
          },
        );
      } else {
        await addDoc(metaCollection, { pesoMeta: novoPesoMeta });
      }

      setPesoMeta(novoPesoMeta);
      setEditandoMeta(false);
    } catch (err) {
      console.error("Erro ao salvar peso meta:", err);
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex flex-col items-center min-h-screen p-4 pt-28 bg-zinc-900 space-y-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white text-center mb-4">
          Treinos Diários
        </h1>

        {/* Resumo */}
        <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl shadow-lg flex flex-col items-center bg-gradient-to-br from-green-700 to-green-500 hover:scale-105 transition-transform duration-200">
            <Dumbbell size={28} className="text-white mb-2" />
            <p className="text-sm text-gray-200">Treinos Semana</p>
            <p className="text-xl font-bold text-white">{treinosSemana}/7</p>
          </div>

          <div className="p-6 rounded-2xl shadow-lg flex flex-col items-center bg-gradient-to-br from-blue-700 to-blue-500 hover:scale-105 transition-transform duration-200">
            <Activity size={28} className="text-white mb-2" />
            <p className="text-sm text-gray-200">Peso Atual</p>
            <p className="text-xl font-bold text-white">{pesoAtual} kg</p>
          </div>

          <div className="p-6 rounded-2xl shadow-lg flex flex-col items-center bg-gradient-to-br from-purple-700 to-purple-500 hover:scale-105 transition-transform duration-200">
            <Camera size={28} className="text-white mb-2" />
            <p className="text-sm text-gray-200">Fotos Enviadas</p>
            <p className="text-xl font-bold text-white">
              {fotosEnviadas}/{fotosTotal}
            </p>
          </div>
        </div>

        {/* Cards de Ação */}
        <div className="w-full max-w-md flex flex-col gap-4">
          <Link
            href="/checkin"
            className="flex items-center justify-center gap-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:scale-105 transition-transform duration-200 text-white py-4 px-6 rounded-xl font-semibold shadow-md"
          >
            <Dumbbell size={22} />
            Novo Treino
          </Link>

          <Link
            href="/progresso"
            className="flex items-center justify-center gap-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:scale-105 transition-transform duration-200 text-white py-4 px-6 rounded-xl font-semibold shadow-md"
          >
            <Activity size={22} />
            Peso & Progresso
          </Link>

          <Link
            href="/fotos"
            className="flex items-center justify-center gap-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:scale-105 transition-transform duration-200 text-white py-4 px-6 rounded-xl font-semibold shadow-md"
          >
            <Camera size={22} />
            Fotos Antes / Depois
          </Link>
        </div>

        {/* Estatísticas Gerais */}
        <div className="w-full max-w-md flex gap-4">
          <div className="flex-1 bg-zinc-800 p-4 rounded-2xl shadow-lg text-center hover:scale-105 transition-transform duration-200">
            <p className="text-gray-300 text-sm">Total de treinos</p>
            <p className="text-white font-bold text-lg">{treinosFeitos}</p>
          </div>

          <div className="flex-1 bg-zinc-800 p-4 rounded-2xl shadow-lg text-center hover:scale-105 transition-transform duration-200">
            <p className="text-gray-300 text-sm">Peso Meta</p>
            {editandoMeta ? (
              <div className="flex items-center justify-center gap-2">
                <input
                  type="number"
                  value={novoPesoMeta}
                  onChange={(e) => setNovoPesoMeta(Number(e.target.value))}
                  className="w-20 p-2 rounded-xl text-center font-bold text-white bg-zinc-700 placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all duration-200"
                  placeholder="kg"
                />
                <button
                  onClick={salvarPesoMeta}
                  className="bg-green-500 hover:bg-green-600 p-2 rounded-lg transition-colors duration-200"
                >
                  <Check size={20} className="text-white" />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <span className="text-white font-bold text-lg">
                  {pesoMeta} kg
                </span>
                <button
                  onClick={() => setEditandoMeta(true)}
                  className="bg-yellow-400 hover:bg-yellow-500 p-1 rounded-lg transition-colors duration-200 cursor-pointer"
                >
                  <Edit2 size={18} className="text-white" />
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
