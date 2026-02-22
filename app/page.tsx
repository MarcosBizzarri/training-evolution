"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      {/* ---------------- NAVBAR ---------------- */}
      <header className="fixed top-0 w-full bg-zinc-950/80 backdrop-blur border-b border-zinc-800 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="font-bold text-xl tracking-wide">
            Training Evolution
          </h1>
        </div>
      </header>

      {/* ---------------- HERO ---------------- */}
      <section className="pt-40 pb-28 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 blur-3xl opacity-40" />

        <div className="relative max-w-4xl mx-auto">
          <span className="bg-blue-600/20 text-blue-400 px-4 py-1 rounded-full text-sm">
            Plataforma de Evolução Fitness
          </span>

          <h2 className="text-5xl sm:text-6xl font-extrabold mt-6 leading-tight">
            Transforme disciplina <br /> em evolução real.
          </h2>

          <p className="text-zinc-400 mt-6 text-lg">
            Registre seus treinos, acompanhe sua constância e construa um
            histórico verdadeiro da sua jornada fitness.
          </p>

          <div className="flex justify-center gap-6 mt-10">
            <Link
              href="/cadastro"
              className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-xl font-bold text-lg transition"
            >
              Começar Gratuitamente
            </Link>

            <Link
              href="/login"
              className="border border-zinc-700 hover:border-white px-8 py-4 rounded-xl font-semibold transition"
            >
              Já tenho conta
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------- BENEFÍCIOS ---------------- */}
      <section className="py-24 px-6 bg-zinc-900">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12 text-center">
          {[
            {
              title: "Constância",
              desc: "Acompanhe sua frequência e desenvolva disciplina real.",
            },
            {
              title: "Organização",
              desc: "Tenha todos seus treinos registrados em um só lugar.",
            },
            {
              title: "Evolução",
              desc: "Visualize seu progresso ao longo do tempo.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-zinc-950 border border-zinc-800 p-8 rounded-2xl hover:border-blue-600 transition"
            >
              <h3 className="text-xl font-bold mb-4">{item.title}</h3>
              <p className="text-zinc-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- COMO FUNCIONA ---------------- */}
      <section className="py-28 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Como funciona?</h2>

          <p className="text-zinc-400 text-lg mb-12">
            Simples, direto e focado no que realmente importa: sua evolução.
          </p>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              "Crie sua conta gratuitamente",
              "Registre seus treinos diariamente",
              "Acompanhe sua evolução e constância",
            ].map((step, index) => (
              <div
                key={step}
                className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800"
              >
                <span className="text-blue-500 text-3xl font-bold">
                  {index + 1}
                </span>
                <p className="mt-4 text-zinc-300">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- NÚMEROS ---------------- */}
      <section className="py-24 px-6 bg-zinc-900">
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
            <p className="text-zinc-400 mt-2">Focado em disciplina</p>
          </div>
        </div>
      </section>

      {/* ---------------- CTA FINAL ---------------- */}
      <section className="py-28 px-6 text-center bg-gradient-to-r from-blue-600 to-purple-600">
        <h2 className="text-4xl font-extrabold mb-6">
          Está pronto para evoluir?
        </h2>

        <p className="mb-8 text-lg">
          Comece hoje mesmo e construa a melhor versão de você.
        </p>

        <Link
          href="/cadastro"
          className="bg-white text-blue-600 px-10 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition"
        >
          Criar Conta Gratuitamente
        </Link>
      </section>

      {/* ---------------- FOOTER ---------------- */}
      <footer className="bg-zinc-950 border-t border-zinc-800 py-10 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 text-sm text-zinc-400">
          <div>
            <h4 className="font-bold text-white mb-3">Training Evolution</h4>
            <p>
              Plataforma criada para transformar disciplina em resultado real.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3">Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/login" className="hover:text-white">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/cadastro" className="hover:text-white">
                  Cadastro
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3">Contato</h4>
            <p>suporte@trainingevolution.com</p>
          </div>
        </div>

        <div className="text-center text-zinc-600 mt-10 text-xs">
          © {new Date().getFullYear()} Training Evolution. Todos os direitos
          reservados.
        </div>
      </footer>
    </div>
  );
}
