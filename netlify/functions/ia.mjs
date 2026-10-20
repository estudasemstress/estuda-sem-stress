// IA do Estuda Sem Stress: confirma a conta, conta os usos do dia e tenta várias IA por ordem.
// As chaves ficam nas variáveis de ambiente do Netlify (nunca no site):
//   GEMINI_API_KEY, GROQ_API_KEY, ANTHROPIC_API_KEY, OPENAI_API_KEY   (põe as que tiveres; basta uma)
//   AI_ORDER      ordem das IA, ex.: "gemini,claude,openai"
//   AI_DAILY_LIMIT  usos por pessoa por dia (por defeito 40)
//   GEMINI_MODEL, CLAUDE_MODEL, OPENAI_MODEL  (opcional, para trocar de modelo sem mexer no código)
import { getStore } from "@netlify/blobs";

const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY || "AIzaSyCl7YAiXb_TVZzUXSantraumEUiZYSUn38";
const OWNER_EMAIL = (process.env.OWNER_EMAIL || "estudasemstress@gmail.com").toLowerCase();
const json = (o, status = 200) => new Response(JSON.stringify(o), { status, headers: { "content-type": "application/json" } });

async function callGemini(prompt, wantJson, deadline) {
  const key = process.env.GEMINI_API_KEY; if (!key) throw new Error("sem chave");
  // primeiro o modelo rápido; se falhar ou estiver ocupado, tenta o seguinte — sempre dentro do tempo limite
  const models = (process.env.GEMINI_MODEL || "gemini-flash-lite-latest,gemini-flash-latest").split(",").map(s => s.trim()).filter(Boolean);
  let last = "";
  for (let i = 0; i < models.length; i++) {
    const model = models[i], left = deadline - Date.now(); if (left < 3000) break;
    // o primeiro modelo não pode gastar o tempo todo: deixa tempo para o seguinte
    const budget = i < models.length - 1 ? Math.max(9000, Math.round(left * 0.6)) : left - 1000;
    // «pensar» deixa o Gemini muito lento: desligamos (se o modelo não aceitar, tentamos sem)
    // modelos antigos aceitam thinkingBudget 0; os novos aceitam thinkingLevel; se nenhum servir, vai sem nada
    const THINK = [{ thinkingBudget: 0 }, { thinkingLevel: "low" }, null];
    for (let k = 0; k < THINK.length; k++) {
      const think = THINK[k], gen = wantJson ? { responseMimeType: "application/json" } : {};
      if (think) gen.thinkingConfig = think;
      try {
        const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`, {
          method: "POST", signal: AbortSignal.timeout(Math.max(1000, Math.min(budget, deadline - Date.now() - 1000))), headers: { "content-type": "application/json" },
          body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }], generationConfig: gen }) });
        if (r.ok) { const j = await r.json(); const t = (j.candidates?.[0]?.content?.parts || []).filter(p => !p.thought).map(p => p.text || "").join(""); if (t) return t; last = model + " vazio"; break; }
        const err = (await r.text()).slice(0, 200).replace(/\s+/g, " ");
        last = (last ? last + " ; " : "") + model + " " + r.status + " " + err.slice(0, 90);
        if (think && r.status === 400) continue; // este modelo não aceita esta forma de pensar menos: tenta a seguinte
        break;
      } catch (e) { last = (last ? last + " ; " : "") + model + " " + (e.name === "TimeoutError" || e.name === "AbortError" ? "demorou demasiado" : e.message); break; }
    }
  }
  throw new Error("gemini " + last);
}
async function callClaude(prompt, wantJson, deadline) {
  const signal = AbortSignal.timeout(Math.max(1000, deadline - Date.now() - 1000));
  const key = process.env.ANTHROPIC_API_KEY; if (!key) throw new Error("sem chave");
  const model = process.env.CLAUDE_MODEL || "claude-haiku-5-5";
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST", signal, headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({ model, max_tokens: 8000, messages: [{ role: "user", content: prompt + (wantJson ? "\n\nResponde só com JSON válido, sem mais texto." : "") }] }) });
  if (!r.ok) throw new Error("claude " + r.status);
  const j = await r.json(); const t = (j.content || []).map(c => c.text || "").join("");
  if (!t) throw new Error("claude vazio"); return t;
}
async function callOpenAI(prompt, wantJson, deadline) {
  const signal = AbortSignal.timeout(Math.max(1000, deadline - Date.now() - 1000));
  const key = process.env.OPENAI_API_KEY; if (!key) throw new Error("sem chave");
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  const r = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST", signal, headers: { "content-type": "application/json", authorization: "Bearer " + key },
    body: JSON.stringify({ model, messages: [{ role: "user", content: prompt + (wantJson ? "\n\nResponde só com JSON válido, sem mais texto." : "") }] }) });
  if (!r.ok) throw new Error("openai " + r.status);
  const j = await r.json(); const t = j.choices?.[0]?.message?.content || "";
  if (!t) throw new Error("openai vazio"); return t;
}
// Groq: grátis e muito rápido (bom plano B quando o Gemini está cheio)
async function callGroq(prompt, wantJson, deadline) {
  const key = process.env.GROQ_API_KEY; if (!key) throw new Error("sem chave");
  const models = (process.env.GROQ_MODEL || "llama-3.3-70b-versatile,openai/gpt-oss-120b,llama-3.1-8b-instant").split(",").map(s => s.trim()).filter(Boolean);
  let last = "";
  for (const model of models) {
    const left = deadline - Date.now(); if (left < 2500) break;
    try {
      const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST", signal: AbortSignal.timeout(left - 800), headers: { "content-type": "application/json", authorization: "Bearer " + key },
        body: JSON.stringify({ model, max_tokens: 8000, messages: [{ role: "user", content: prompt + (wantJson ? "\n\nResponde só com JSON válido, sem mais texto." : "") }] }) });
      if (r.ok) { const j = await r.json(); const t = j.choices?.[0]?.message?.content || ""; if (t) return t; last = model + " vazio"; continue; }
      last = (last ? last + " ; " : "") + model + " " + r.status + " " + (await r.text()).slice(0, 90).replace(/\s+/g, " ");
    } catch (e) { last = (last ? last + " ; " : "") + model + " " + (e.name === "TimeoutError" || e.name === "AbortError" ? "demorou demasiado" : e.message); }
  }
  throw new Error("groq " + last);
}
const PROVIDERS = { gemini: callGemini, groq: callGroq, claude: callClaude, openai: callOpenAI };
const KEYS = { gemini: "GEMINI_API_KEY", groq: "GROQ_API_KEY", claude: "ANTHROPIC_API_KEY", openai: "OPENAI_API_KEY" };

export default async (req) => {
  if (req.method !== "POST") return json({ error: "método" }, 405);
  const tok = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  if (!tok) return json({ error: "login" }, 401);
  // 1) confirmar que é uma conta verdadeira do site
  const v = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${FIREBASE_API_KEY}`, {
    method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ idToken: tok }) }).catch(() => null);
  if (!v || !v.ok) return json({ error: "login" }, 401);
  const user = (await v.json()).users?.[0]; if (!user?.localId) return json({ error: "login" }, 401);
  const isOwner = (user.email || "").toLowerCase() === OWNER_EMAIL && user.emailVerified;
  // 2) pedido
  let body; try { body = await req.json(); } catch { return json({ error: "pedido" }, 400); }
  const prompt = String(body.prompt || "").slice(0, 60000); if (!prompt.trim()) return json({ error: "vazio" }, 400);
  // 3) limite por dia
  const LIMIT = Math.max(1, parseInt(process.env.AI_DAILY_LIMIT || "40", 10));
  const store = getStore("uso-ia"); const day = new Date().toISOString().slice(0, 10); const key = `${day}/${user.localId}`;
  const used = parseInt((await store.get(key)) || "0", 10) || 0;
  if (!isOwner && used >= LIMIT) return json({ error: "limite", used, limit: LIMIT }, 429);
  // 4) tentar as IA por ordem; se uma falhar, passa à seguinte
  const deadline = Date.now() + 23000; // o Netlify corta aos ~26-30 s: respondemos sempre antes
  const order = (process.env.AI_ORDER || "gemini,groq,claude,openai").split(",").map(s => s.trim()).filter(p => PROVIDERS[p] && process.env[KEYS[p]]);
  const errors = [];
  for (let i = 0; i < order.length; i++) {
    const p = order[i];
    if (deadline - Date.now() < 3000) { errors.push(p + ": sem tempo"); continue; }
    // se houver outra IA depois, esta não pode gastar o tempo todo (o Gemini às vezes fica preso)
    const until = i < order.length - 1 ? Math.min(deadline, Date.now() + Math.max(8000, Math.round((deadline - Date.now()) * 0.55))) : deadline;
    try {
      const text = await PROVIDERS[p](prompt, !!body.json, until);
      await store.set(key, String(used + 1));
      return json({ text, provider: p, used: used + 1, limit: isOwner ? null : LIMIT });
    } catch (e) { errors.push(p + ": " + e.message); }
  }
  console.log("IA falhou:", errors.join(" | ") || "nenhuma chave de IA configurada");
  return json({ error: "nenhuma IA respondeu", used, limit: LIMIT }, 503);
};
export const config = { path: "/api/ia" };
