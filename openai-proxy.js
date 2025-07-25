// Express-style API route stub for secure OpenAI integration
// Place in your backend (e.g. serverless function, Node.js server)
require('dotenv').config();
const fetch = require('node-fetch');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
  const { prompt, model, temperature, functions, max_tokens } = req.body;
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'OpenAI API key not set' });
  try {
    const payload = {
      model: model || 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: typeof temperature === 'number' ? temperature : 0.5,
      functions,
      max_tokens: max_tokens || 1200
    };
    const oaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    const data = await oaiRes.json();
    if (!oaiRes.ok) return res.status(502).json({ error: data.error?.message || 'OpenAI Err' });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
