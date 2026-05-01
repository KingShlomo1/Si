import type { PostStatus } from '@/types';

const CONFIG: Record<PostStatus, { label: string; bg: string; color: string }> = {
  draft:            { label: 'Draft',            bg: 'rgba(144,144,184,0.15)', color: '#9090b8' },
  pending_approval: { label: 'Pending Approval', bg: 'rgba(245,158,11,0.15)',  color: '#f59e0b' },
  approved:         { label: 'Approved',          bg: 'rgba(16,185,129,0.15)', color: '#10b981' },
  published:        { label: 'Published',         bg: 'rgba(59,130,246,0.15)', color: '#3b82f6' },
  rejected:         { label: 'Rejected',          bg: 'rgba(239,68,68,0.15)',  color: '#ef4444' },
};

export default function StatusBadge({ status }: { status: PostStatus }) {
  const { label, bg, color } = CONFIG[status];
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold"
      style={{ background: bg, color }}>
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color }} />
      {label}
    </span>
  );
}
