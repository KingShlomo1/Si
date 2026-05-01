'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import type { BrandVoice } from '@/types';

interface ProfileUpdate {
  display_name?: string;
  brand_voice?: BrandVoice;
}

export async function updateProfile(data: ProfileUpdate) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  await supabase.from('profiles').update({
    ...data,
    updated_at: new Date().toISOString(),
  }).eq('id', user.id);

  revalidatePath('/settings');
}
