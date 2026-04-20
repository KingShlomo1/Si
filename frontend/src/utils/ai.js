import Anthropic from '@anthropic-ai/sdk';

function getClient() {
  const key = localStorage.getItem('anthropic_key');
  if (!key) throw new Error('NO_KEY');
  return new Anthropic({ apiKey: key, dangerouslyAllowBrowser: true });
}

async function ask(prompt, maxTokens = 1024) {
  const client = getClient();
  const msg = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: maxTokens,
    messages: [{ role: 'user', content: prompt }],
  });
  return msg.content[0].text;
}

export async function generateCaptions(description, tone, platform, count = 3) {
  return ask(
    `You are an expert social media copywriter. Write ${count} ${platform} captions for this post.\n` +
    `Tone: ${tone}\nDescription: ${description}\n\n` +
    `Format EXACTLY as:\nCaption 1:\n[full caption with emojis and hashtags]\n\nCaption 2:\n[full caption]\n\nCaption 3:\n[full caption]`,
    1500
  );
}

export async function generateScript(topic, platform, duration, style) {
  return ask(
    `You are a viral video script writer. Write a ${duration}-second ${platform} script.\n` +
    `Topic: ${topic}\nStyle: ${style}\n\n` +
    `Format with these sections:\n` +
    `🎣 HOOK (0-3s):\n[attention-grabbing opener]\n\n` +
    `📖 MAIN CONTENT (3-${parseInt(duration) - 10}s):\n[key points with timestamps]\n\n` +
    `💡 VALUE BOMB:\n[the key takeaway]\n\n` +
    `📣 CALL TO ACTION (last 5s):\n[what to do next]\n\n` +
    `📝 CAPTION:\n[matching caption with hashtags]`,
    2048
  );
}

export async function suggestHashtags(niche, postType, caption) {
  return ask(
    `You are an Instagram hashtag strategist. Generate a complete hashtag strategy for:\n` +
    `Niche: ${niche}\nPost type: ${postType}\nCaption: ${caption}\n\n` +
    `Provide exactly:\n` +
    `🔥 HIGH REACH (5 tags, 1M+ posts):\n[hashtags]\n\n` +
    `🎯 MID RANGE (7 tags, 100k-1M posts):\n[hashtags]\n\n` +
    `💎 NICHE (8 tags, <100k posts):\n[hashtags]\n\n` +
    `⭐ BRANDED/COMMUNITY (5 tags):\n[hashtags]`,
    512
  );
}

export async function generateBio(name, niche, vibe, cta) {
  return ask(
    `Write 3 Instagram bio options for:\nName: ${name}\nNiche/job: ${niche}\nVibe: ${vibe}\nCTA goal: ${cta}\n\n` +
    `Each bio must be under 150 characters, use emojis, and have a clear CTA.\n\n` +
    `Format as:\nBio 1:\n[bio]\n\nBio 2:\n[bio]\n\nBio 3:\n[bio]`,
    600
  );
}

export async function generateIdeas(niche, goal, count = 10) {
  return ask(
    `You are a viral content strategist. Generate ${count} content ideas for a ${niche} creator.\n` +
    `Goal: ${goal}\n\n` +
    `For each idea provide:\n` +
    `[number]. 🎯 [Title]\nFormat: [Reel/Carousel/Story/Post]\nHook: [opening line]\nWhy it works: [one sentence]\n`,
    1500
  );
}

export async function rewriteCaption(caption, instruction) {
  return ask(
    `Rewrite this Instagram caption with the following instruction: ${instruction}\n\nOriginal:\n${caption}\n\nRewritten caption:`,
    600
  );
}

export async function generatePostText(template, details) {
  return ask(
    `Write bold, punchy text for an Instagram ${template} graphic.\nDetails: ${details}\n\n` +
    `Return only the text that should appear on the image. Keep it short (max 10 words), impactful, and stylish.`,
    100
  );
}
