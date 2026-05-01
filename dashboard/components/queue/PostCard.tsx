'use client';

import Link from 'next/link';
import { Calendar, Trash2 } from 'lucide-react';
import StatusBadge from './StatusBadge';
import type { Post, PlatformName } from '@/types';
import { PLATFORM_LABELS } from '@/types';

const PLATFORM_COLORS: Record<PlatformName, string> = {
  twitter_x: '#1d9bf0', instagram: '#e1306c', linkedin: '#0077b5',
  tiktok: '#ff0050', facebook: '#1877f2',
};

export default function PostCard({ post, onDelete }: { post: Post; onDelete: (id: string) => void }) {
  return (
    <div className="rounded-2xl p-4 flex flex-col gap-3 transition-all hover:border-purple-light/30"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>

      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <StatusBadge status={post.status} />
        {post.ai_assisted && (
          <span className="text-xs px-2 py-0.5 rounded-md font-semibold"
            style={{ background: 'rgba(124,58,237,0.15)', color: 'var(--purple-light)' }}>✨ AI</span>
        )}
      </div>

      {/* Caption preview */}
      <p className="text-sm leading-relaxed line-clamp-3" style={{ color: 'var(--text)' }}>
        {post.caption || <span style={{ color: 'var(--text3)' }}>No caption yet...</span>}
      </p>

      {/* Platform chips */}
      {post.platforms.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {post.platforms.map(p => (
            <span key={p} className="text-xs px-2 py-0.5 rounded-md font-semibold"
              style={{ background: PLATFORM_COLORS[p] + '22', color: PLATFORM_COLORS[p] }}>
              {PLATFORM_LABELS[p]}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text3)' }}>
          <Calendar size={11} />
          {post.scheduled_at
            ? new Date(post.scheduled_at).toLocaleDateString()
            : new Date(post.created_at).toLocaleDateString()}
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/queue/${post.id}`}
            className="text-xs font-semibold px-2.5 py-1 rounded-lg transition-all hover:opacity-80"
            style={{ background: 'rgba(124,58,237,0.15)', color: 'var(--purple-light)' }}>
            Review →
          </Link>
          <button onClick={() => onDelete(post.id)}
            className="p-1.5 rounded-lg transition-all hover:opacity-80"
            style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
