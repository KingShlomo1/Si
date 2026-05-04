import Link from 'next/link';
import { PenSquare } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import KanbanBoard from '@/components/queue/KanbanBoard';
import { deletePost } from '@/actions/posts';
import type { Post } from '@/types';

export default async function QueuePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false });

  return (
    <div className="animate-fade-up">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-black" style={{ color: 'var(--text)' }}>Post Queue</h2>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text2)' }}>Manage your content approval pipeline</p>
        </div>
        <Link href="/compose"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white"
          style={{ background: 'var(--grad)' }}>
          <PenSquare size={14} /> New Post
        </Link>
      </div>

      <KanbanBoard initialPosts={(posts as Post[]) ?? []} onDelete={deletePost} />
    </div>
  );
}
