"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { auth, db, storage } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  DocumentData,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { User } from "firebase/auth";

type FotoItem = {
  id: string;
  url: string;
  descricao?: string;
};

export default function Fotos() {
  const [fotos, setFotos] = useState<FotoItem[]>([]);
  const [user, setUser] = useState<User | null>(null);

  // Monitorar usuário logado
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Buscar fotos do Firestore
  useEffect(() => {
    if (!user) return;

    const fetchFotos = async () => {
      try {
        const snapshot = await getDocs(collection(db, "users", user.uid, "fotos"));
        const lista: FotoItem[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as DocumentData),
        })) as FotoItem[];
        setFotos(lista);
      } catch (error) {
        console.error("Erro ao buscar fotos:", error);
      }
    };

    fetchFotos();
  }, [user]);

  // Upload da foto
  const adicionarFoto = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) return;
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const storageRef = ref(storage, `users/${user.uid}/fotos/${file.name}`);

    try {
      // Upload da imagem
      await uploadBytes(storageRef, file);

      // Pega a URL pública
      const url = await getDownloadURL(storageRef);

      // Salva no Firestore
      const docRef = await addDoc(collection(db, "users", user.uid, "fotos"), {
        url,
        descricao: "Nova Foto",
      });

      // Atualiza estado local
      setFotos((prev) => [...prev, { id: docRef.id, url, descricao: "Nova Foto" }]);

      // Limpar input
      event.target.value = "";
    } catch (error) {
      console.error("Erro ao enviar a foto:", error);
      alert("Não foi possível enviar a foto.");
    }
  };

  // Excluir foto
  const excluirFoto = async (foto: FotoItem) => {
    if (!user) return;
    if (!confirm("Deseja realmente excluir esta foto?")) return;

    try {
      // Deleta do Storage
      const storageRef = ref(storage, `users/${user.uid}/fotos/${foto.url.split("%2F").pop()?.split("?")[0]}`);
      await deleteObject(storageRef);

      // Deleta do Firestore
      await deleteDoc(doc(db, "users", user.uid, "fotos", foto.id));

      setFotos((prev) => prev.filter((f) => f.id !== foto.id));
    } catch (error) {
      console.error("Erro ao excluir a foto:", error);
      alert("Não foi possível excluir a foto.");
    }
  };

  // Editar descrição
  const editarFoto = async (id: string) => {
    const foto = fotos.find((f) => f.id === id);
    if (!foto || !user) return;

    const novaDescricao = prompt("Editar descrição (Antes/Depois):", foto.descricao || "");
    if (novaDescricao === null) return;

    try {
      await updateDoc(doc(db, "users", user.uid, "fotos", id), { descricao: novaDescricao });
      setFotos((prev) =>
        prev.map((f) => (f.id === id ? { ...f, descricao: novaDescricao } : f))
      );
    } catch (error) {
      console.error("Erro ao editar a foto:", error);
      alert("Não foi possível editar a foto.");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900">
      <Navbar />
      <main className="flex flex-col items-center justify-start pt-28 p-4 space-y-6 w-full max-w-5xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-white text-center">
          📸 Meu Antes / Depois
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
          {fotos.map((foto) => (
            <div key={foto.id} className="bg-zinc-800 rounded-xl overflow-hidden shadow-md flex flex-col">
              <img src={foto.url} alt={foto.descricao} className="w-full h-48 object-cover" />
              {foto.descricao && (
                <div className="p-2 text-white text-center font-semibold">{foto.descricao}</div>
              )}
              <div className="flex justify-center gap-3 p-2 text-sm">
                <button
                  onClick={() => editarFoto(foto.id)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-1 rounded-md font-semibold transition cursor-pointer"
                >
                  ✏️ Editar
                </button>
                <button
                  onClick={() => excluirFoto(foto)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md font-semibold transition cursor-pointer"
                >
                  🗑️ Excluir
                </button>
              </div>
            </div>
          ))}
        </div>

        <label className="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow-md text-lg cursor-pointer transition transform hover:scale-105">
          ➕ Adicionar Foto
          <input type="file" accept="image/*" onChange={adicionarFoto} className="hidden" />
        </label>
      </main>
    </div>
  );
}
