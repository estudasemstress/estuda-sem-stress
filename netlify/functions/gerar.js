// Função do Netlify: liga o criador.html à IA, mantendo a chave escondida no servidor.
// A chave vai em Netlify > Site configuration > Environment variables > ANTHROPIC_API_KEY
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Método não permitido' };
  try {
    const { system, user } = JSON.parse(event.body || '{}');
    if (!system || !user) return { statusCode: 400, body: JSON.stringify({ error: 'Faltam dados' }) };
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-5-5',
        max_tokens: 6000,
        system: String(system).slice(0, 8000),
        messages: [{ role: 'user', content: String(user).slice(0, 60000) }]
      })
    });
    const d = await r.json();
    if (!r.ok) return { statusCode: 502, body: JSON.stringify({ error: (d.error && d.error.message) || 'Erro da IA' }) };
    const text = (d.content || []).filter(b => b.type === 'text').map(b => b.text).join('');
    return { statusCode: 200, headers: { 'content-type': 'application/json' }, body: JSON.stringify({ text }) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Erro no servidor' }) };
  }
};
