import type { BrandVoice } from '@/types';

export function buildBrandVoiceSystem(voice: BrandVoice): string {
  const parts = [
    `You are a professional social media copywriter writing on behalf of a brand.`,
    ``,
    `BRAND VOICE:`,
    `- Tone: ${voice.tone || 'authentic and engaging'}`,
  ];

  if (voice.audience) parts.push(`- Target audience: ${voice.audience}`);
  if (voice.avoid) parts.push(`- Avoid: ${voice.avoid}`);
  if (voice.keywords?.length) parts.push(`- Keywords to weave in: ${voice.keywords.join(', ')}`);
  if (voice.sample_posts?.length) {
    parts.push(``, `EXAMPLE POSTS (match this style):`);
    voice.sample_posts.slice(0, 3).forEach((p, i) => parts.push(`${i + 1}. ${p}`));
  }

  parts.push(``, `Always write in first person as the brand. Be concise, natural, and never generic.`);
  return parts.join('\n');
}

export function buildDraftPostPrompt(
  description: string,
  platforms: string[],
  tone?: string,
  extras?: string
): string {
  const platformStr = platforms.length ? platforms.join(', ') : 'social media';
  return [
    `Draft a ${platformStr} post caption for the following:`,
    ``,
    `Topic / Description: ${description}`,
    tone ? `Tone adjustment: ${tone}` : '',
    extras ? `Additional context: ${extras}` : '',
    ``,
    `Requirements:`,
    `- Respect character limits (280 chars for Twitter/X, 2200 for Instagram, 3000 for LinkedIn)`,
    `- Include relevant emojis where natural`,
    `- End with 1-2 sentences that drive engagement`,
    `- Add 3-5 relevant hashtags at the end for Instagram/TikTok`,
    ``,
    `Output only the caption text, nothing else.`,
  ].filter(Boolean).join('\n');
}

export function buildDraftReplyPrompt(originalComment: string, context: string): string {
  return [
    `Draft a friendly, on-brand reply to the following comment or mention:`,
    ``,
    `Original comment: "${originalComment}"`,
    context ? `Context (what the post was about): ${context}` : '',
    ``,
    `Requirements:`,
    `- Keep it under 200 characters if possible`,
    `- Sound genuine, not robotic`,
    `- Address the commenter directly`,
    `- Do not use generic phrases like "Thanks for your comment!"`,
    ``,
    `Output only the reply text, nothing else.`,
  ].filter(Boolean).join('\n');
}

export function buildContentIdeasPrompt(niche: string, goal: string, count: number): string {
  return [
    `Generate ${count} content ideas for a ${niche} brand.`,
    `Goal: ${goal}`,
    ``,
    `For each idea provide:`,
    `[number]. 🎯 [Catchy title]`,
    `Format: [Reel/Carousel/Single Image/Story/Thread]`,
    `Hook: [First line / opening hook]`,
    `Why it works: [One sentence]`,
    ``,
    `Make each idea specific, actionable, and tailored to the niche. Avoid generic advice.`,
  ].join('\n');
}
