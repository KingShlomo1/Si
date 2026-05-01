'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import type { PostStatus } from '@/types';
import { STATUS_TRANSITIONS } from '@/types';

export async function deletePost(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  await supabase.from('posts').delete().eq('id', id).eq('user_id', user.id);
  revalidatePath('/queue');
}

export async function transitionPostStatus(id: string, toStatus: PostStatus, note?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const { data: post } = await supabase.from('posts').select('status').eq('id', id).single();
  if (!post) throw new Error('Post not found');

  const allowed = STATUS_TRANSITIONS[post.status as PostStatus];
  if (!allowed.includes(toStatus)) {
    throw new Error(`Cannot transition from ${post.status} to ${toStatus}`);
  }

  const updates: Record<string, unknown> = { status: toStatus, updated_at: new Date().toISOString() };
  if (toStatus === 'approved') { updates.approved_by = user.id; updates.approved_at = new Date().toISOString(); }
  if (toStatus === 'published') { updates.published_at = new Date().toISOString(); }
  if (toStatus === 'rejected' && note) { updates.rejection_note = note; }

  await supabase.from('posts').update(updates).eq('id', id);
  await supabase.from('post_status_history').insert({
    post_id: id,
    from_status: post.status,
    to_status: toStatus,
    changed_by: user.id,
    note: note ?? null,
  });

  revalidatePath('/queue');
  revalidatePath(`/queue/${id}`);
}
