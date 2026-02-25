"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function HomePage() {
  const [showButton, setShowButton] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Evitar rolagem quando menu mobile aberto
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto";
  }, [menuOpen]);

  useEffect(() => {
    const handleScroll = () => setShowButton(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-white scroll-smooth">
      {/* NAVBAR */}
      <header className="fixed top-0 w-full bg-zinc-950/80 backdrop-blur border-b border-zinc-800 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* LOGO */}
          <h1 className="font-bold text-xl tracking-wide">
            Training Evolution
          </h1>

          {/* MENU DESKTOP */}
          <nav className="hidden md:flex gap-8 text-sm text-zinc-400">
            <a href="#inicio" className="hover:text-white transition">
              Início
            </a>
            <a href="#beneficios" className="hover:text-white transition">
              Benefícios
            </a>
            <a href="#como" className="hover:text-white transition">
              Como funciona
            </a>
            <a href="#numeros" className="hover:text-white transition">
              Resultados
            </a>
          </nav>

          {/* BOTÃO DESKTOP */}
          <div className="hidden md:block">
            <Link
              href="/cadastro"
              className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg text-sm font-semibold transition"
            >
              Começar
            </Link>
          </div>

          {/* NAVBAR MOBILE */}
          <div className="md:hidden relative z-50">
            {/* Botão Hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex flex-col justify-center items-center w-10 h-10 gap-1 focus:outline-none"
            >
              <span
                className={`block h-0.5 w-6 bg-white rounded transition-all duration-300 ${
                  menuOpen ? "rotate-45 translate-y-1.5" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-6 bg-white rounded transition-all duration-300 ${
                  menuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-6 bg-white rounded transition-all duration-300 ${
                  menuOpen ? "-rotate-45 -translate-y-1.5" : ""
                }`}
              />
            </button>

            {/* Overlay */}
            <div
              className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
                menuOpen
                  ? "opacity-100 pointer-events-auto"
                  : "opacity-0 pointer-events-none"
              }`}
              onClick={() => setMenuOpen(false)}
            ></div>

            {/* Menu Lateral */}
            <div
              className={`fixed top-0 right-0 h-full w-64 bg-zinc-900 shadow-2xl z-50 transform transition-transform duration-300 ${
                menuOpen ? "translate-x-0" : "translate-x-full"
              } flex flex-col justify-center items-start p-8 space-y-6`}
            >
              <a
                href="#inicio"
                onClick={() => setMenuOpen(false)}
                className="text-zinc-200 hover:text-white text-lg font-medium transition"
              >
                Início
              </a>
              <a
                href="#beneficios"
                onClick={() => setMenuOpen(false)}
                className="text-zinc-200 hover:text-white text-lg font-medium transition"
              >
                Benefícios
              </a>
              <a
                href="#como"
                onClick={() => setMenuOpen(false)}
                className="text-zinc-200 hover:text-white text-lg font-medium transition"
              >
                Como funciona
              </a>
              <a
                href="#numeros"
                onClick={() => setMenuOpen(false)}
                className="text-zinc-200 hover:text-white text-lg font-medium transition"
              >
                Resultados
              </a>
              <Link
                href="/cadastro"
                onClick={() => setMenuOpen(false)}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold w-full text-center py-3 rounded-lg transition transform hover:scale-105"
              >
                Começar
              </Link>
            </div>
          </div>
        </div>

        {/* OVERLAY MOBILE */}
        <div
          className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
          onClick={() => setMenuOpen(false)}
        ></div>

        {/* MENU LATERAL MOBILE */}
        <div
          className={`fixed top-0 right-0 h-full w-64 bg-zinc-900 shadow-2xl z-50 transform transition-transform duration-300 ${menuOpen ? "translate-x-0" : "translate-x-full"} flex flex-col justify-center items-start p-8 space-y-6`}
        >
          <a
            href="#inicio"
            onClick={() => setMenuOpen(false)}
            className="text-zinc-200 hover:text-white text-lg font-medium transition"
          >
            Início
          </a>
          <a
            href="#beneficios"
            onClick={() => setMenuOpen(false)}
            className="text-zinc-200 hover:text-white text-lg font-medium transition"
          >
            Benefícios
          </a>
          <a
            href="#como"
            onClick={() => setMenuOpen(false)}
            className="text-zinc-200 hover:text-white text-lg font-medium transition"
          >
            Como funciona
          </a>
          <a
            href="#numeros"
            onClick={() => setMenuOpen(false)}
            className="text-zinc-200 hover:text-white text-lg font-medium transition"
          >
            Resultados
          </a>

          <Link
            href="/cadastro"
            onClick={() => setMenuOpen(false)}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold w-full text-center py-3 rounded-lg transition transform hover:scale-105"
          >
            Começar
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section id="inicio" className="pt-40 pb-28 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="bg-blue-600/20 text-blue-400 px-4 py-1 rounded-full text-sm">
              Plataforma de Evolução Fitness
            </span>

            <h2 className="text-5xl font-extrabold mt-6 leading-tight">
              Pare de treinar sem direção.
              <br />
              Transforme disciplina em evolução real.
            </h2>

            <p className="text-zinc-400 mt-6 text-lg">
              Registre seus treinos, acompanhe sua constância e construa um
              histórico verdadeiro da sua jornada fitness.
            </p>

            <div className="flex gap-6 mt-10 flex-wrap">
              <Link
                href="/cadastro"
                className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-xl font-bold transition hover:scale-105"
              >
                Começar Gratuitamente
              </Link>

              <Link
                href="/login"
                className="border border-zinc-700 hover:border-white px-8 py-4 rounded-xl transition"
              >
                Já tenho conta
              </Link>
            </div>
          </div>

          {/* MOCKUP */}
          <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 p-8 rounded-3xl border border-zinc-800 shadow-xl">
            <div className="bg-zinc-900 rounded-2xl p-6 text-zinc-400">
              <p className="mb-2">📅 Treinos registrados</p>
              <p className="mb-2">🔥 Sequência atual: 7 dias</p>
              <p>📈 Evolução semanal +12%</p>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFÍCIOS */}
      <section id="beneficios" className="py-24 px-6 bg-zinc-900">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12 text-center">
          {[
            {
              title: "Constância",
              desc: "Acompanhe sua frequência e desenvolva disciplina real.",
            },
            {
              title: "Organização",
              desc: "Todos seus treinos registrados em um só lugar.",
            },
            {
              title: "Evolução",
              desc: "Visualize seu progresso ao longo do tempo.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-zinc-950 border border-zinc-800 p-8 rounded-2xl hover:scale-105 hover:border-blue-600 transition duration-300"
            >
              <h3 className="text-xl font-bold mb-4">{item.title}</h3>
              <p className="text-zinc-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como" className="py-28 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Como funciona?</h2>
          <div className="grid md:grid-cols-3 gap-10 mt-12">
            {[
              "Crie sua conta gratuitamente",
              "Registre seus treinos diariamente",
              "Acompanhe sua evolução",
            ].map((step, i) => (
              <div
                key={i}
                className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800"
              >
                <span className="text-blue-500 text-3xl font-bold">
                  {i + 1}
                </span>
                <p className="mt-4 text-zinc-300">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NÚMEROS */}
      <section id="numeros" className="py-24 px-6 bg-zinc-900">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-3 gap-12 text-center">
          <div>
            <p className="text-5xl font-extrabold text-blue-500">+500</p>
            <p className="text-zinc-400 mt-2">Check-ins registrados</p>
          </div>
          <div>
            <p className="text-5xl font-extrabold text-blue-500">+120</p>
            <p className="text-zinc-400 mt-2">Usuários ativos</p>
          </div>
          <div>
            <p className="text-5xl font-extrabold text-blue-500">100%</p>
            <p className="text-zinc-400 mt-2">Foco em disciplina</p>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-28 px-6 text-center bg-gradient-to-r from-blue-600 to-purple-600">
        <h2 className="text-4xl font-extrabold mb-6">
          Está pronto para evoluir?
        </h2>

        <Link
          href="/cadastro"
          className="bg-white text-blue-600 px-10 py-4 rounded-2xl font-bold hover:scale-105 transition"
        >
          Criar Conta Gratuitamente
        </Link>
      </section>

      {/* BOTÃO VOLTAR AO TOPO */}
      {showButton && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 p-4 rounded-full shadow-lg hover:scale-110 transition cursor-pointer"
        >
          ↑
        </button>
      )}

      {/* FOOTER */}
      <footer className="bg-zinc-950 border-t border-zinc-800 py-14 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 text-sm text-zinc-400">
          <div>
            <h4 className="font-bold text-white mb-4 text-lg">
              Training Evolution
            </h4>
            <p>
              Plataforma criada para transformar disciplina em resultado real.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4 text-lg">Navegação</h4>
            <ul className="space-y-3">
              <li>
                <a href="#inicio" className="hover:text-white transition">
                  Início
                </a>
              </li>
              <li>
                <a href="#beneficios" className="hover:text-white transition">
                  Benefícios
                </a>
              </li>
              <li>
                <a href="#como" className="hover:text-white transition">
                  Como funciona
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4 text-lg">Conta</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/login" className="hover:text-white transition">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/cadastro" className="hover:text-white transition">
                  Criar conta
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="text-center text-zinc-600 mt-12 text-xs border-t border-zinc-800 pt-6">
          © {new Date().getFullYear()} Training Evolution. Todos os direitos
          reservados.
        </div>
      </footer>
    </div>
  );
}
