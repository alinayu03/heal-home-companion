// src/pages/api/ask-nurse.ts or src/app/api/ask-nurse/route.ts (for Next.js 13+ App Router)

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  const { message } = req.body;

  try {
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are a friendly and knowledgeable AI nurse assistant.' },
          { role: 'user', content: message }
        ],
      }),
    });

    const openaiData = await openaiRes.json();
    const reply = openaiData.choices?.[0]?.message?.content;

    res.status(200).json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error talking to AI' });
  }
}
