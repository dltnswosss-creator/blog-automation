import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { buildPrompt } from '@/lib/prompts';
import type { GenerateRequest, BlogPost } from '@/lib/types';
import { randomUUID } from 'crypto';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const body = (await req.json()) as GenerateRequest;
  const { pillar, topic, keywords = '', memo = '' } = body;

  if (!pillar || !topic) {
    return NextResponse.json({ error: '필라와 주제는 필수입니다.' }, { status: 400 });
  }

  const prompt = buildPrompt(pillar, topic, keywords, memo);

  const completion = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    max_tokens: 8192,
    messages: [
      {
        role: 'system',
        content:
          '당신은 한국어 PT 트레이너 블로그 전문 작가입니다. 요청된 주제에 대해 충분히 길고 상세한 블로그 글을 JSON 형식으로만 출력하세요. JSON 외 다른 텍스트는 절대 출력하지 마세요.',
      },
      { role: 'user', content: prompt },
    ],
  });

  const finishReason = completion.choices[0].finish_reason;
  const raw = completion.choices[0].message.content?.trim() ?? '';

  if (!raw) {
    return NextResponse.json(
      { error: `AI 응답이 비어있습니다 (finish_reason: ${finishReason})` },
      { status: 500 }
    );
  }

  let parsed: { title: string; content: string; naverTags: string[] };
  try {
    const jsonStr = raw.replace(/^```json?\s*/m, '').replace(/\s*```$/m, '').trim();
    parsed = JSON.parse(jsonStr);
  } catch {
    return NextResponse.json({ error: 'AI 응답 파싱 실패', raw: raw.slice(0, 300) }, { status: 500 });
  }

  if (!parsed.title || !parsed.content) {
    return NextResponse.json({ error: 'title 또는 content 필드 누락', parsed }, { status: 500 });
  }

  const post: BlogPost = {
    id: randomUUID(),
    pillar,
    topic,
    keywords,
    title: parsed.title,
    content: parsed.content,
    naverTags: Array.isArray(parsed.naverTags) ? parsed.naverTags : [],
    charCount: parsed.content.length,
    createdAt: new Date().toISOString(),
  };

  return NextResponse.json(post);
}
