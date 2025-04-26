import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { messages } = req.body as { messages: any };

  try {
    const anthropicRes = await fetch(
      'https://api.anthropic.com/v1/messages',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY!,   // <— set in .env.local
        },
        body: JSON.stringify({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 1024,
          messages,
        }),
      },
    );

    if (!anthropicRes.ok) {
      throw new Error(await anthropicRes.text());
    }

    const data = await anthropicRes.json();
    // `data.content` is an array; grab the assistant’s first text block
    res.status(200).json({ response: data.content?.[0]?.text ?? '' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Anthropic request failed' });
  }
}
