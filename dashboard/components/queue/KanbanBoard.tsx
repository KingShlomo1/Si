'use client';

import { useState } from 'react';
import PostCard from './PostCard';
import type { Post, PostStatus } from '@/types';
import { STATUS_LABELS } from '@/types';

const COLUMNS: PostStatus[] = ['draft', 'pending_approval', 'approved', 'published'];

const COL_COLORS: Record<PostStatus, string> = {
  draft:            'var(--text3)',
  pending_approval: '#f59e0b',
  approved:         '#10b981',
  published:        '#3b82f6',
  rejected:         '#ef4444',
};

interface Props {
  initialPosts: Post[];
  onDelete: (id: string) => Promise<void>;
}

export default function KanbanBoard({ initialPosts, onDelete }: Props) {
  const [posts, setPosts] = useState(initialPosts);

  async function handleDelete(id: string) {
    setPosts(p => p.filter(x => x.id !== id));
    await onDelete(id);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {COLUMNS.map(status => {
        const colPosts = posts.filter(p => p.status === status);
        return (
          <div key={status}>
            {/* Column header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ background: COL_COLORS[status] }} />
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text2)' }}>
                  {STATUS_LABELS[status]}
                </span>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-md"
                style={{ background: 'var(--surface)', color: 'var(--text3)' }}>
                {colPosts.length}
              </span>
            </div>

            {/* Cards */}
            <div className="flex flex-col gap-3 min-h-[200px] p-3 rounded-2xl"
              style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}>
              {colPosts.length === 0 && (
                <div className="flex-1 flex items-center justify-center py-8">
                  <span className="text-xs" style={{ color: 'var(--text3)' }}>No posts</span>
                </div>
              )}
              {colPosts.map(post => (
                <PostCard key={post.id} post={post} onDelete={handleDelete} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
