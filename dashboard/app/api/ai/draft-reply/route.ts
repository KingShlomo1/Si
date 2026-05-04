import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@/lib/supabase/server';
import { buildBrandVoiceSystem, buildDraftReplyPrompt } from '@/lib/ai/prompts';
import type { BrandVoice } from '@/types';

export const runtime = 'edge';

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response('Unauthorized', { status: 401 });

  const { comment, context = '' } = await req.json();
  if (!comment?.trim()) return new Response('Missing comment', { status: 400 });

  const { data: profile } = await supabase
    .from('profiles').select('brand_voice').eq('id', user.id).single();

  const voice = (profile?.brand_voice ?? { tone: 'friendly and authentic', audience: '', avoid: '', sample_posts: [], keywords: [] }) as BrandVoice;

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

  const stream = await anthropic.messages.stream({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 300,
    system: buildBrandVoiceSystem(voice),
    messages: [{ role: 'user', content: buildDraftReplyPrompt(comment, context) }],
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
          controller.enqueue(encoder.encode(chunk.delta.text));
        }
      }
      controller.close();

      const finalMessage = await stream.finalMessage();
      const content = finalMessage.content[0]?.type === 'text' ? finalMessage.content[0].text : '';
      if (content) {
        await supabase.from('ai_drafts').insert({
          user_id: user.id,
          draft_type: 'reply',
          prompt_inputs: { comment, context },
          content,
          model_used: 'claude-haiku-4-5-20251001',
        });
      }
    },
  });

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Transfer-Encoding': 'chunked' },
  });
}
