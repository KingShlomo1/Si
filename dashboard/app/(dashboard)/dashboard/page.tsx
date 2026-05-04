import { createClient } from '@/lib/supabase/server';
import { TrendingUp, Clock, CheckCircle, Send, Sparkles, PenSquare } from 'lucide-react';
import Link from 'next/link';
import type { PostStatus, StatusCounts } from '@/types';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: posts }, { data: platforms }, { data: drafts }] = await Promise.all([
    supabase.from('posts').select('status, created_at').eq('user_id', user!.id),
    supabase.from('connected_platforms').select('platform').eq('user_id', user!.id).eq('is_active', true),
    supabase.from('ai_drafts').select('id, draft_type, created_at').eq('user_id', user!.id).order('created_at', { ascending: false }).limit(5),
  ]);

  const counts: StatusCounts = { draft: 0, pending_approval: 0, approved: 0, published: 0, rejected: 0 };
  posts?.forEach(p => { counts[p.status as PostStatus] = (counts[p.status as PostStatus] ?? 0) + 1; });

  const statCards = [
    { label: 'Drafts',          value: counts.draft,            icon: PenSquare,    color: '#8b5cf6' },
    { label: 'Pending Approval', value: counts.pending_approval, icon: Clock,        color: '#f59e0b' },
    { label: 'Approved',         value: counts.approved,         icon: CheckCircle,  color: '#10b981' },
    { label: 'Published',        value: counts.published,        icon: Send,         color: '#3b82f6' },
  ];

  return (
    <div className="max-w-4xl mx-auto animate-fade-up">
      {/* Welcome */}
      <div className="mb-8">
        <h2 className="text-2xl font-black mb-1" style={{ color: 'var(--text)' }}>
          Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'} 👋
        </h2>
        <p className="text-sm" style={{ color: 'var(--text2)' }}>
          {platforms?.length ? `${platforms.length} platform${platforms.length > 1 ? 's' : ''} connected` : 'Connect your platforms to get started'}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-2xl p-5" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: color + '22' }}>
                <Icon size={18} style={{ color }} />
              </div>
              <TrendingUp size={13} style={{ color: 'var(--text3)' }} />
            </div>
            <div className="text-3xl font-black mb-1" style={{ color: 'var(--text)' }}>{value}</div>
            <div className="text-xs font-semibold" style={{ color: 'var(--text2)' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Link href="/compose" className="group rounded-2xl p-5 flex items-center gap-4 transition-all hover:scale-[1.02]"
          style={{ background: 'var(--grad)', boxShadow: '0 4px 24px rgba(124,58,237,0.3)' }}>
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
            <PenSquare size={22} className="text-white" />
          </div>
          <div>
            <div className="font-bold text-white">Compose New Post</div>
            <div className="text-xs text-white/70 mt-0.5">Draft with AI or write yourself</div>
          </div>
        </Link>

        <Link href="/ai" className="group rounded-2xl p-5 flex items-center gap-4 transition-all hover:scale-[1.02]"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(124,58,237,0.15)' }}>
            <Sparkles size={22} style={{ color: '#8b5cf6' }} />
          </div>
          <div>
            <div className="font-bold" style={{ color: 'var(--text)' }}>AI Assistant</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--text2)' }}>Draft replies & content ideas</div>
          </div>
        </Link>
      </div>

      {/* Recent AI drafts */}
      {drafts && drafts.length > 0 && (
        <div className="rounded-2xl p-5" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm" style={{ color: 'var(--text)' }}>Recent AI Drafts</h3>
            <Link href="/ai" className="text-xs font-semibold" style={{ color: 'var(--purple-light)' }}>View all →</Link>
          </div>
          <div className="flex flex-col gap-2">
            {drafts.map(d => (
              <div key={d.id} className="flex items-center justify-between py-2 border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-3">
                  <Sparkles size={13} style={{ color: 'var(--purple-light)' }} />
                  <span className="text-sm capitalize" style={{ color: 'var(--text2)' }}>
                    {d.draft_type.replace(/_/g, ' ')}
                  </span>
                </div>
                <span className="text-xs" style={{ color: 'var(--text3)' }}>
                  {new Date(d.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No platforms CTA */}
      {(!platforms || platforms.length === 0) && (
        <div className="mt-8 rounded-2xl p-6 text-center" style={{ background: 'rgba(124,58,237,0.08)', border: '1px dashed rgba(124,58,237,0.3)' }}>
          <div className="text-3xl mb-3">🔗</div>
          <h3 className="font-bold mb-1" style={{ color: 'var(--text)' }}>Connect your platforms</h3>
          <p className="text-sm mb-4" style={{ color: 'var(--text2)' }}>Link your social accounts to start managing them from here.</p>
          <Link href="/platforms"
            className="inline-block px-5 py-2.5 rounded-xl text-sm font-bold text-white"
            style={{ background: 'var(--grad)' }}>
            Connect Platforms
          </Link>
        </div>
      )}
    </div>
  );
}
