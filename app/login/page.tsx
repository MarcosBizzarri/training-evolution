"use client";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [erro, setErro] = useState("");

  async function entrar() {
    if (!email || !senha) {
      alert("Preencha todos os campos");
      return;
    }

    try {
      setLoading(true);

      await signInWithEmailAndPassword(auth, email, senha);
      window.location.href = "/app";
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErro(error.message);
      } else {
        setErro("Erro desconhecido ao logar");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-zinc-900 animate-fade-in">
      <div className="w-full max-w-md space-y-6 bg-zinc-800 p-8 rounded-2xl shadow-2xl border border-zinc-700">
        <h1 className="text-3xl font-bold text-center text-white">Login</h1>

        <input
          className="w-full p-3 rounded bg-gray-100 text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full p-3 pr-10 rounded bg-gray-100 text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
        </div>

        <button
          onClick={entrar}
          disabled={loading}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90 text-white p-3 rounded-xl font-semibold disabled:opacity-50 transition cursor-pointer"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>

        <p className="text-center text-sm text-gray-300">
          Ainda não tem conta?{" "}
          <a href="/cadastro" className="text-blue-400 underline">
            Cadastre-se
          </a>
        </p>

        {erro && <p className="text-red-400 text-sm text-center">{erro}</p>}
      </div>
    </main>
  );
}