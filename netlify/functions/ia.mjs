// IA do Estuda Sem Stress: confirma a conta, conta os usos do dia e tenta várias IA por ordem.
// As chaves ficam nas variáveis de ambiente do Netlify (nunca no site):
//   GEMINI_API_KEY, ANTHROPIC_API_KEY, OPENAI_API_KEY   (põe as que tiveres; basta uma)
//   AI_ORDER      ordem das IA, ex.: "gemini,claude,openai"
//   AI_DAILY_LIMIT  usos por pessoa por dia (por defeito 40)
//   GEMINI_MODEL, CLAUDE_MODEL, OPENAI_MODEL  (opcional, para trocar de modelo sem mexer no código)
import { getStore } from "@netlify/blobs";

const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY || "AIzaSyCl7YAiXb_TVZzUXSantraumEUiZYSUn38";
const OWNER_EMAIL = (process.env.OWNER_EMAIL || "estudasemstress@gmail.com").toLowerCase();
const json = (o, status = 200) => new Response(JSON.stringify(o), { status, headers: { "content-type": "application/json" } });

async function callGemini(prompt, wantJson, signal) {
  const key = process.env.GEMINI_API_KEY; if (!key) throw new Error("sem chave");
  const model = process.env.GEMINI_MODEL || "gemini-flash-latest";
  const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`, {
    method: "POST", signal, headers: { "content-type": "application/json" },
    body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }], generationConfig: wantJson ? { responseMimeType: "application/json" } : {} }) });
  if (!r.ok) throw new Error("gemini " + r.status);
  const j = await r.json(); const t = (j.candidates?.[0]?.content?.parts || []).map(p => p.text || "").join("");
  if (!t) throw new Error("gemini vazio"); return t;
}
async function callClaude(prompt, wantJson, signal) {
  const key = process.env.ANTHROPIC_API_KEY; if (!key) throw new Error("sem chave");
  const model = process.env.CLAUDE_MODEL || "claude-haiku-5-5";
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST", signal, headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({ model, max_tokens: 8000, messages: [{ role: "user", content: prompt + (wantJson ? "\n\nResponde só com JSON válido, sem mais texto." : "") }] }) });
  if (!r.ok) throw new Error("claude " + r.status);
  const j = await r.json(); const t = (j.content || []).map(c => c.text || "").join("");
  if (!t) throw new Error("claude vazio"); return t;
}
async function callOpenAI(prompt, wantJson, signal) {
  const key = process.env.OPENAI_API_KEY; if (!key) throw new Error("sem chave");
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  const r = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST", signal, headers: { "content-type": "application/json", authorization: "Bearer " + key },
    body: JSON.stringify({ model, messages: [{ role: "user", content: prompt + (wantJson ? "\n\nResponde só com JSON válido, sem mais texto." : "") }] }) });
  if (!r.ok) throw new Error("openai " + r.status);
  const j = await r.json(); const t = j.choices?.[0]?.message?.content || "";
  if (!t) throw new Error("openai vazio"); return t;
}
const PROVIDERS = { gemini: callGemini, claude: callClaude, openai: callOpenAI };

export default async (req) => {
  if (req.method !== "POST") return json({ error: "método" }, 405);
  const tok = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  if (!tok) return json({ error: "login" }, 401);
  const v = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${FIREBASE_API_KEY}`, {
    method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ idToken: tok }) }).catch(() => null);
  if (!v || !v.ok) return json({ error: "login" }, 401);
  const user = (await v.json()).users?.[0]; if (!user?.localId) return json({ error: "login" }, 401);
  const isOwner = (user.email || "").toLowerCase() === OWNER_EMAIL && user.emailVerified;
  let body; try { body = await req.json(); } catch { return json({ error: "pedido" }, 400); }
  const prompt = String(body.prompt || "").slice(0, 60000); if (!prompt.trim()) return json({ error: "vazio" }, 400);
  const LIMIT = Math.max(1, parseInt(process.env.AI_DAILY_LIMIT || "40", 10));
  const store = getStore("uso-ia"); const day = new Date().toISOString().slice(0, 10); const key = `${day}/${user.localId}`;
  const used = parseInt((await store.get(key)) || "0", 10) || 0;
  if (!isOwner && used >= LIMIT) return json({ error: "limite", used, limit: LIMIT }, 429);
  const order = (process.env.AI_ORDER || "gemini,claude,openai").split(",").map(s => s.trim()).filter(p => PROVIDERS[p]);
  const errors = [];
  for (const p of order) {
    try {
      const text = await PROVIDERS[p](prompt, !!body.json, AbortSignal.timeout(55000));
      await store.set(key, String(used + 1));
      return json({ text, provider: p, used: used + 1, limit: isOwner ? null : LIMIT });
    } catch (e) { errors.push(p + ": " + e.message); }
  }
  console.log("IA falhou:", errors.join(" | "));
  return json({ error: "nenhuma IA respondeu", used, limit: LIMIT }, 503);
};
export const config = { path: "/api/ia" };
