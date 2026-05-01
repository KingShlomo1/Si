'use server';

import { createClient } from '@/lib/supabase/server';
import type { PlatformName, ConnectedPlatform } from '@/types';

export async function connectPlatform(platform: PlatformName, username: string): Promise<ConnectedPlatform | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase.from('connected_platforms').upsert({
    user_id: user.id,
    platform,
    platform_username: username,
    access_token: `PLACEHOLDER_CONNECTED_v1_${platform}`,
    is_active: true,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id,platform' }).select().single();

  return data as ConnectedPlatform | null;
}

export async function disconnectPlatform(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from('connected_platforms').delete().eq('id', id).eq('user_id', user.id);
}
