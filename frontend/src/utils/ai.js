import Anthropic from '@anthropic-ai/sdk';

function getClient() {
  const key = localStorage.getItem('anthropic_key');
  if (!key) throw new Error('NO_KEY');
  return new Anthropic({ apiKey: key, dangerouslyAllowBrowser: true });
}

export async function generateCaptions(description, tone) {
  const client = getClient();
  const msg = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    messages: [{
      role: 'user',
      content: `Write 3 Instagram captions for this post. Tone: ${tone}.\nDescription: ${description}\n\nFormat each caption as:\nCaption 1:\n[caption with hashtags]\n\nCaption 2:\n[caption with hashtags]\n\nCaption 3:\n[caption with hashtags]`,
    }],
  });
  return msg.content[0].text;
}

export async function generateScript(topic, platform, duration) {
  const client = getClient();
  const msg = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 2048,
    messages: [{
      role: 'user',
      content: `Write a ${duration}-second ${platform} video script about: ${topic}.\n\nInclude:\n- Hook (first 3 seconds)\n- Main content\n- Call to action\n\nFormat with clear sections and estimated timing.`,
    }],
  });
  return msg.content[0].text;
}

export async function suggestHashtags(caption) {
  const client = getClient();
  const msg = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 256,
    messages: [{
      role: 'user',
      content: `Suggest 15 relevant Instagram hashtags for this caption. Return only the hashtags separated by spaces, no explanation.\n\nCaption: ${caption}`,
    }],
  });
  return msg.content[0].text;
}
