import React, { useState } from "react";

/**
 * Cocktail Studio - Mockup React App (fixed)
 * -----------------------------------------
 * - Removed fragile `lucide-react` imports that caused CDN fetch/build failures.
 * - Replaced external icons with inline SVG components (self-contained).
 * - Exported small utilities for testing: `sanitize`, `generateMockRecipes`, `runUnitTests`.
 * - Kept the original UX: Laboratório de Ideias, Estúdio Visual, Pesquisador Técnico.
 */

// -------------------- Inline Icon Components --------------------
const IconSparkles = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M12 2l1.2 3.2L16.5 6 13.6 8 14.8 11 12 9 9.2 11 10.4 8 7.5 6 10.8 5.2 12 2z" fill="currentColor" />
    <path d="M4 14l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z" fill="currentColor" opacity="0.9" />
  </svg>
);

const IconImage = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="9" cy="9" r="1.6" fill="currentColor" />
    <path d="M21 17l-5-5-4 4-3-3-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

const IconBook = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M20 2H8.5A2.5 2.5 0 0 0 6 4.5v14A2.5 2.5 0 0 0 8.5 21H20V2z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconDownload = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M12 3v12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 11l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M21 21H3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// -------------------- Utilities (exported for tests) --------------------
export function sanitize(text) {
  if (typeof text !== "string") return "";
  // remove control chars, collapse whitespace, trim
  return text.replace(/[\u0000-\u001F\u007F]/g, "").replace(/\s+/g, " ").trim();
}

export function generateMockRecipes(ingredient) {
  const safe = sanitize(ingredient);
  if (!safe) return [];

  return [
    {
      title: `${safe} Royale`,
      ingredients: ["50ml vodka", "20ml licor de flor", `10g ${safe} syrup`],
      method: "Shake com gelo, coar em taça resfriada, decorar com zeste",
    },
    {
      title: `${safe} Fumée`,
      ingredients: ["40ml bourbon", "15ml vermute", `Infusão de ${safe}`],
      method: "Stir, servir sobre gelo, fumaça de madeira leve",
    },
    {
      title: `${safe} Spritz`,
      ingredients: ["60ml prosecco", "30ml soda", `20ml cordial de ${safe}`],
      method: "Montar em copo com gelo, guarnecer com ervas",
    },
  ];
}

// small fake API to simulate latency
const fakeApi = (result, delay = 800) => new Promise((res) => setTimeout(() => res(result), delay));

// -------------------- Basic in-file tests --------------------
export function runUnitTests() {
  const results = [];

  // sanitize basic
  const s1 = sanitize("  lime \n");
  results.push({ name: "sanitize trims whitespace", pass: s1 === "lime", expected: "lime", actual: s1 });

  const s2 = sanitize("\u0000te\u0001st");
  results.push({ name: "sanitize removes control chars", pass: s2.includes("te") && s2.includes("st"), expected: "test", actual: s2 });

  // generateMockRecipes
  const recs = generateMockRecipes("maracujá");
  results.push({ name: "generateMockRecipes returns 3 items", pass: recs.length === 3, expected: 3, actual: recs.length });
  results.push({ name: "titles contain ingredient", pass: recs.every(r => r.title.includes("maracujá")), expected: true, actual: recs.every(r => r.title.includes("maracujá")) });

  const empty = generateMockRecipes("");
  results.push({ name: "generateMockRecipes with empty returns []", pass: Array.isArray(empty) && empty.length === 0, expected: 0, actual: empty.length });

  return results;
}

// -------------------- Main component --------------------
export default function CocktailStudioApp() {
  const [active, setActive] = useState("ideas"); // ideas | studio | research

  // --- Laboratório de Ideias ---
  const [ingredient, setIngredient] = useState("");
  const [ideaLoading, setIdeaLoading] = useState(false);
  const [generatedRecipes, setGeneratedRecipes] = useState([]);

  async function handleGenerateRecipes() {
    const safe = sanitize(ingredient);
    if (!safe) return;
    setIdeaLoading(true);
    const response = await fakeApi(generateMockRecipes(safe), 600 + Math.random() * 800);
    setGeneratedRecipes(response);
    setIdeaLoading(false);
  }

  // --- Estúdio Visual ---
  const [visualPrompt, setVisualPrompt] = useState("");
  const [visualLoading, setVisualLoading] = useState(false);
  const [visualPreview, setVisualPreview] = useState(null);

  async function handleGenerateImage() {
    const safe = sanitize(visualPrompt);
    if (!safe) return;
    setVisualLoading(true);

    const svg = `<?xml version="1.0" encoding="utf-8"?>\n<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'>\n  <rect width='100%' height='100%' fill='%23FAF5FF'/>\n  <text x='50%' y='45%' text-anchor='middle' font-family='Segoe UI, Arial' font-size='48' fill='%235B2C6F'>${safe}</text>\n  <text x='50%' y='60%' text-anchor='middle' font-family='Segoe UI, Arial' font-size='28' fill='%23A2193B'>— Cocktail Studio</text>\n</svg>`;
    const url = 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
    const image = await fakeApi(url, 700 + Math.random() * 600);
    setVisualPreview(image);
    setVisualLoading(false);
  }

  // --- Pesquisador Técnico ---
  const [researchQuery, setResearchQuery] = useState("");
  const [researchLoading, setResearchLoading] = useState(false);
  const [researchResult, setResearchResult] = useState("");

  async function handleResearch() {
    const safe = sanitize(researchQuery);
    if (!safe) return;
    setResearchLoading(true);
    const summary = await fakeApi(
      `Resumo curto sobre '${safe}': a técnica envolve balancear acidez, doçura e corpo; atenção a solubilidade de aromas e temperatura de serviço. Sugestões práticas: testar em pequenas doses, documentar pH do xarope.`,
      800 + Math.random() * 500
    );
    setResearchResult(summary);
    setResearchLoading(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-neutral-50 to-amber-50 p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6">
        {/* Sidebar */}
        <aside className="col-span-12 md:col-span-3 bg-white rounded-2xl p-6 shadow">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-white font-bold">CS</div>
            <div>
              <div className="text-sm font-semibold">Cocktail Studio</div>
              <div className="text-xs text-zinc-500">Assistente pessoal de IA • Mockup</div>
            </div>
          </div>

          <nav className="mt-6 flex flex-col gap-2">
            <button
              onClick={() => setActive("ideas")}
              className={`text-left px-3 py-2 rounded-lg ${active === "ideas" ? "bg-purple-50 border border-purple-100" : "hover:bg-gray-50"}`}>
              <div className="flex items-center gap-3">
                <IconSparkles className="w-5 h-5 text-purple-600" />
                <div>
                  <div className="font-medium">Laboratório de Ideias</div>
                  <div className="text-xs text-zinc-500">Geração rápida de receitas</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => setActive("studio")}
              className={`text-left px-3 py-2 rounded-lg ${active === "studio" ? "bg-purple-50 border border-purple-100" : "hover:bg-gray-50"}`}>
              <div className="flex items-center gap-3">
                <IconImage className="w-5 h-5 text-rose-500" />
                <div>
                  <div className="font-medium">Estúdio Visual</div>
                  <div className="text-xs text-zinc-500">Imagens de qualidade para redes</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => setActive("research")}
              className={`text-left px-3 py-2 rounded-lg ${active === "research" ? "bg-purple-50 border border-purple-100" : "hover:bg-gray-50"}`}>
              <div className="flex items-center gap-3">
                <IconBook className="w-5 h-5 text-green-600" />
                <div>
                  <div className="font-medium">Pesquisador Técnico</div>
                  <div className="text-xs text-zinc-500">Química & história da coquetelaria</div>
                </div>
              </div>
            </button>
          </nav>

          <div className="mt-6 text-xs text-zinc-500">Dica: comece pelo Laboratório de Ideias para gerar receitas rápidas, depois crie imagens no Estúdio Visual e valide conceitos no Pesquisador Técnico.</div>
        </aside>

        {/* Main content */}
        <main className="col-span-12 md:col-span-9">
          <div className="bg-white rounded-2xl p-6 shadow min-h-[520px]">
            {/* Header of active module */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">
                  {active === "ideas" && "Laboratório de Ideias"}
                  {active === "studio" && "Estúdio Visual"}
                  {active === "research" && "Pesquisador Técnico"}
                </h2>
                <p className="text-sm text-zinc-500 mt-1">
                  {active === "ideas" && "Insira um ingrediente ou conceito e receba receitas inovadoras em segundos."}
                  {active === "studio" && "Crie imagens de qualidade de estúdio para redes sociais descrevendo o drink."}
                  {active === "research" && "Tenha um especialista em química de alimentos e história da coquetelaria à disposição."}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <input className="hidden md:block px-3 py-2 border rounded-lg text-sm" placeholder="Pesquisar" />
                <button className="px-3 py-2 rounded-lg bg-purple-600 text-white text-sm">Conectar</button>
              </div>
            </div>

            <div className="mt-6">
              {active === "ideas" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="col-span-1 md:col-span-2">
                    <label className="text-sm font-medium">Ingrediente ou conceito</label>
                    <input value={ingredient} onChange={(e) => setIngredient(e.target.value)} placeholder="Ex.: maracujá, fumaça, cítrico" className="w-full mt-2 px-3 py-2 border rounded-lg" />

                    <div className="flex items-center gap-3 mt-4">
                      <button onClick={handleGenerateRecipes} className="px-4 py-2 rounded-lg bg-amber-500 text-white shadow">{ideaLoading ? "Gerando..." : "Gerar Receitas"}</button>
                      <button onClick={() => { setIngredient(""); setGeneratedRecipes([]); }} className="px-4 py-2 rounded-lg border">Limpar</button>
                    </div>

                    <div className="mt-6 space-y-4">
                      {generatedRecipes.length === 0 && <div className="text-sm text-zinc-500">Nenhuma receita gerada ainda.</div>}
                      {generatedRecipes.map((r, idx) => (
                        <article key={idx} className="p-4 bg-gray-50 rounded-lg border">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold">{r.title}</h3>
                              <div className="text-sm text-zinc-600 mt-1">{r.method}</div>
                            </div>
                            <div className="text-sm text-zinc-400">#{idx + 1}</div>
                          </div>
                          <div className="mt-3 text-sm">
                            <strong>Ingredientes:</strong>
                            <ul className="list-disc pl-5 mt-1">
                              {r.ingredients.map((ing, i) => (
                                <li key={i}>{ing}</li>
                              ))}
                            </ul>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>

                  <aside className="hidden md:block p-4 border rounded-lg">
                    <div className="text-xs text-zinc-500">Prompt sugerido</div>
                    <div className="mt-2 text-sm bg-white p-3 rounded">"Crie 3 receitas autorais usando &lt;ingrediente&gt;, com método e guarnição."</div>

                    <div className="mt-4">
                      <div className="text-xs text-zinc-500">Histórico rápido</div>
                      <ul className="mt-2 text-sm list-disc pl-5 text-zinc-600">
                        <li>Maracujá Royale — testado</li>
                        <li>Fumaça Citrus — 2 variantes</li>
                      </ul>
                    </div>
                  </aside>
                </div>
              )}

              {active === "studio" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="col-span-2">
                    <label className="text-sm font-medium">Descreva a imagem que deseja</label>
                    <input value={visualPrompt} onChange={(e) => setVisualPrompt(e.target.value)} placeholder="Ex.: close-up de coquetel com fumaça, luz quente, fundo escuro" className="w-full mt-2 px-3 py-2 border rounded-lg" />

                    <div className="flex items-center gap-3 mt-4">
                      <button onClick={handleGenerateImage} className="px-4 py-2 rounded-lg bg-rose-500 text-white shadow">{visualLoading ? "Gerando imagem..." : "Gerar Imagem"}</button>
                      <button onClick={() => { setVisualPrompt(""); setVisualPreview(null); }} className="px-4 py-2 rounded-lg border">Limpar</button>
                    </div>

                    <div className="mt-6">
                      {visualPreview ? (
                        <div className="rounded-lg overflow-hidden border">
                          <img src={visualPreview} alt="Preview" className="w-full h-auto block" />
                          <div className="p-3 flex items-center justify-between">
                            <div className="text-sm text-zinc-600">Preview gerado — imagem mock</div>
                            <div className="flex items-center gap-2">
                              <button className="px-3 py-1 rounded bg-gray-100">Editar</button>
                              <button className="px-3 py-1 rounded bg-purple-600 text-white"><IconDownload className="w-4 h-4 inline-block" /> Exportar</button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-zinc-500">Nenhuma imagem gerada ainda.</div>
                      )}
                    </div>
                  </div>

                  <aside className="p-4 border rounded-lg">
                    <div className="text-xs text-zinc-500">Estilos populares</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <button className="px-3 py-1 rounded bg-gray-100 text-sm">Luz natural</button>
                      <button className="px-3 py-1 rounded bg-gray-100 text-sm">Fundo escuro</button>
                      <button className="px-3 py-1 rounded bg-gray-100 text-sm">Detalhe de ingredientes</button>
                    </div>

                    <div className="mt-4 text-xs text-zinc-500">Export</div>
                    <div className="mt-2 text-sm">PNG / JPG / mockup para story</div>
                  </aside>
                </div>
              )}

              {active === "research" && (
                <div>
                  <label className="text-sm font-medium">Pergunte ao pesquisador técnico</label>
                  <input value={researchQuery} onChange={(e) => setResearchQuery(e.target.value)} placeholder="Ex.: Como estabilizar emulsões com clara de ovo?" className="w-full mt-2 px-3 py-2 border rounded-lg" />
                  <div className="flex items-center gap-3 mt-4">
                    <button onClick={handleResearch} className="px-4 py-2 rounded-lg bg-green-600 text-white shadow">{researchLoading ? "Pesquisando..." : "Pesquisar"}</button>
                    <button onClick={() => { setResearchQuery(""); setResearchResult(""); }} className="px-4 py-2 rounded-lg border">Limpar</button>
                  </div>

                  <div className="mt-6 bg-gray-50 p-4 rounded-lg border">
                    {researchResult ? (
                      <div>
                        <div className="text-sm text-zinc-500">Resumo técnico</div>
                        <div className="mt-2 text-sm">{researchResult}</div>
                      </div>
                    ) : (
                      <div className="text-sm text-zinc-500">Nenhuma pesquisa realizada ainda.</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer quick actions */}
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-zinc-500">Versão demo • Não compartilhável</div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-2 rounded-lg border">Salvar rascunho</button>
              <button className="px-3 py-2 rounded-lg bg-purple-600 text-white">Solicitar demonstração</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
