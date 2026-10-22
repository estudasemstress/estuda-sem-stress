exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Método não permitido' };
  try {
    const { system, user } = JSON.parse(event.body || '{}');
    if (!system || !user) return { statusCode: 400, body: JSON.stringify({ error: 'Faltam dados' }) };
    const modelo = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelo}:generateContent`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-goog-api-key': process.env.GEMINI_API_KEY },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: String(system).slice(0, 8000) }] },
        contents: [{ role: 'user', parts: [{ text: String(user).slice(0, 60000) }] }],
        generationConfig: { maxOutputTokens: 8000, responseMimeType: 'application/json' }
      })
    });
    const d = await r.json();
    if (!r.ok) return { statusCode: 502, body: JSON.stringify({ error: (d.error && d.error.message) || 'Erro da IA' }) };
    const text = ((d.candidates && d.candidates[0] && d.candidates[0].content && d.candidates[0].content.parts) || []).map(p => p.text || '').join('');
    return { statusCode: 200, headers: { 'content-type': 'application/json' }, body: JSON.stringify({ text }) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Erro no servidor' }) };
  }
};
