"use client";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  async function entrar() {
    if (!email || !senha) {
      alert("Preencha todos os campos");
      return;
    }

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, senha);
      window.location.href = "/";
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Erro desconhecido ao logar");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-zinc-900">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-3xl font-bold text-center text-white">Login</h1>

        <input
          className="w-full p-3 rounded bg-gray-100 text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full p-3 rounded bg-gray-100 text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Senha"
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />

        <button
          onClick={entrar}
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-xl font-semibold disabled:opacity-50 transition"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>

        <p className="text-center text-sm text-gray-300">
          Ainda não tem conta?{" "}
          <a href="/cadastro" className="text-blue-400 underline">
            Cadastre-se
          </a>
        </p>
      </div>
    </main>
  );
}
