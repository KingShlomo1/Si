import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import StatusBadge from '@/components/queue/StatusBadge';
import { transitionPostStatus } from '@/actions/posts';
import type { Post, PostStatus, PlatformName } from '@/types';
import { PLATFORM_LABELS, STATUS_TRANSITIONS } from '@/types';

export default async function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: post } = await supabase
    .from('posts').select('*').eq('id', id).eq('user_id', user!.id).single();

  if (!post) notFound();

  const p = post as Post;
  const nextStatuses = STATUS_TRANSITIONS[p.status];

  const STATUS_ACTION_LABELS: Partial<Record<PostStatus, string>> = {
    pending_approval: 'Submit for Review',
    approved:         'Approve ✓',
    published:        'Mark Published',
    rejected:         'Reject ✗',
  };

  const ACTION_STYLES: Partial<Record<PostStatus, string>> = {
    approved:  'var(--grad)',
    rejected:  'rgba(239,68,68,0.2)',
    published: 'rgba(59,130,246,0.2)',
    pending_approval: 'rgba(245,158,11,0.15)',
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-up">
      <Link href="/queue" className="inline-flex items-center gap-2 text-sm mb-6 hover:opacity-70 transition-all"
        style={{ color: 'var(--text2)' }}>
        <ArrowLeft size={14} /> Back to Queue
      </Link>

      <div className="rounded-2xl p-6" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <StatusBadge status={p.status} />
          {p.ai_assisted && (
            <span className="text-xs px-2 py-1 rounded-lg font-semibold"
              style={{ background: 'rgba(124,58,237,0.15)', color: 'var(--purple-light)' }}>✨ AI-assisted</span>
          )}
        </div>

        {/* Caption */}
        <div className="mb-6">
          <label className="block text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--text2)' }}>Caption</label>
          <p className="text-sm leading-relaxed whitespace-pre-wrap p-4 rounded-xl"
            style={{ background: 'var(--bg2)', color: 'var(--text)', border: '1px solid var(--border)' }}>
            {p.caption || 'No caption'}
          </p>
        </div>

        {/* Metadata grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text2)' }}>Platforms</label>
            <div className="flex flex-wrap gap-1.5">
              {p.platforms.length > 0
                ? p.platforms.map((pl: PlatformName) => (
                  <span key={pl} className="text-xs px-2 py-1 rounded-lg font-medium"
                    style={{ background: 'var(--surface2)', color: 'var(--text2)' }}>
                    {PLATFORM_LABELS[pl]}
                  </span>
                ))
                : <span style={{ color: 'var(--text3)', fontSize: '13px' }}>None</span>
              }
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text2)' }}>Scheduled</label>
            <p className="text-sm" style={{ color: 'var(--text)' }}>
              {p.scheduled_at ? new Date(p.scheduled_at).toLocaleString() : 'Not scheduled'}
            </p>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text2)' }}>Created</label>
            <p className="text-sm" style={{ color: 'var(--text)' }}>{new Date(p.created_at).toLocaleString()}</p>
          </div>
          {p.rejection_note && (
            <div className="col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: '#ef4444' }}>Rejection Note</label>
              <p className="text-sm p-3 rounded-xl" style={{ background: 'rgba(239,68,68,0.08)', color: '#f87171' }}>
                {p.rejection_note}
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        {nextStatuses.length > 0 && (
          <div className="flex flex-wrap gap-3 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
            {nextStatuses.map(nextStatus => (
              <form key={nextStatus} action={async () => {
                'use server';
                await transitionPostStatus(p.id, nextStatus);
                redirect('/queue');
              }}>
                <button type="submit"
                  className="px-4 py-2 rounded-xl text-sm font-bold transition-all hover:opacity-80"
                  style={{
                    background: ACTION_STYLES[nextStatus] ?? 'var(--surface2)',
                    color: nextStatus === 'approved' ? '#fff' : nextStatus === 'rejected' ? '#ef4444' : 'var(--text)',
                    border: '1px solid var(--border)',
                  }}>
                  {STATUS_ACTION_LABELS[nextStatus] ?? nextStatus}
                </button>
              </form>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
