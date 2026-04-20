import { load } from '../utils/storage.js';

const QUOTES = [
  "Content is king. Consistency is queen.",
  "Your story deserves to be told.",
  "Create content that moves people.",
  "One post can change everything.",
  "Show up, create, repeat.",
];

export default function Dashboard({ onNavigate }) {
  const posts = load('content_schedule');
  const upcoming = posts.filter(p => p.status === 'Planned').length;
  const posted = posts.filter(p => p.status === 'Posted').length;
  const quote = QUOTES[new Date().getDay() % QUOTES.length];
  const hasKey = !!localStorage.getItem('anthropic_key');

  const tools = [
    { id: 'captions', icon: '✨', label: 'AI Captions', desc: 'Generate scroll-stopping captions', color: '#7c3aed' },
    { id: 'script',   icon: '🎬', label: 'Video Scripts', desc: 'Write viral video scripts', color: '#ec4899' },
    { id: 'ideas',    icon: '💡', label: 'Content Ideas', desc: 'Never run out of ideas', color: '#f59e0b' },
    { id: 'hashtags', icon: '🔥', label: 'Hashtag Research', desc: 'Find the perfect hashtags', color: '#10b981' },
    { id: 'write',    icon: '✏️', label: 'Caption Writer', desc: 'Craft & refine captions', color: '#3b82f6' },
    { id: 'bio',      icon: '👤', label: 'Bio Generator', desc: 'Create a killer bio', color: '#8b5cf6' },
    { id: 'designer', icon: '🎨', label: 'Post Designer', desc: 'Design & export posts', color: '#ef4444' },
    { id: 'schedule', icon: '📅', label: 'Content Calendar', desc: 'Plan your content strategy', color: '#06b6d4' },
  ];

  return (
    <div className="page fadeIn">
      {/* Hero */}
      <div style={s.hero}>
        <div style={s.heroGrad} />
        <p style={s.heroQuote}>"{quote}"</p>
        <h1 style={s.heroTitle}>Creator Studio</h1>
        <p style={s.heroSub}>Everything you need to create professional content</p>
      </div>

      {/* Stats */}
      <div style={s.statsRow}>
        <div style={s.stat}>
          <div style={s.statNum}>{upcoming}</div>
          <div style={s.statLabel}>Scheduled</div>
        </div>
        <div style={s.statDivider} />
        <div style={s.stat}>
          <div style={s.statNum}>{posted}</div>
          <div style={s.statLabel}>Posted</div>
        </div>
        <div style={s.statDivider} />
        <div style={s.stat}>
          <div style={s.statNum}>{upcoming + posted}</div>
          <div style={s.statLabel}>Total Posts</div>
        </div>
      </div>

      {!hasKey && (
        <div style={s.alert} onClick={() => onNavigate('settings')}>
          <span style={s.alertIcon}>🔑</span>
          <div>
            <div style={s.alertTitle}>Add your AI key to unlock all features</div>
            <div style={s.alertSub}>Tap here to set up → free at console.anthropic.com</div>
          </div>
          <span style={s.alertChevron}>›</span>
        </div>
      )}

      {/* Tools Grid */}
      <h2 style={s.sectionTitle}>Your Tools</h2>
      <div style={s.grid}>
        {tools.map(tool => (
          <button key={tool.id} onClick={() => onNavigate(tool.id)} style={s.toolCard}>
            <div style={{ ...s.toolIcon, background: tool.color + '22', color: tool.color }}>
              {tool.icon}
            </div>
            <div style={s.toolLabel}>{tool.label}</div>
            <div style={s.toolDesc}>{tool.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

const s = {
  hero: { position: 'relative', borderRadius: 20, padding: '32px 24px', marginBottom: 20, overflow: 'hidden', background: 'linear-gradient(135deg,#2d1b69,#1a1a3e)' },
  heroGrad: { position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at top right, rgba(124,58,237,0.4) 0%, transparent 60%)', pointerEvents: 'none' },
  heroQuote: { fontSize: 12, color: 'rgba(255,255,255,0.5)', fontStyle: 'italic', marginBottom: 12, position: 'relative' },
  heroTitle: { fontSize: 32, fontWeight: 900, background: 'linear-gradient(135deg,#fff,#c4b5fd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: 8, position: 'relative' },
  heroSub: { fontSize: 14, color: 'rgba(255,255,255,0.6)', position: 'relative' },
  statsRow: { display: 'flex', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '16px 20px', marginBottom: 20, alignItems: 'center' },
  stat: { flex: 1, textAlign: 'center' },
  statNum: { fontSize: 28, fontWeight: 800, background: 'var(--grad)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' },
  statLabel: { fontSize: 12, color: 'var(--text2)', fontWeight: 600, marginTop: 2 },
  statDivider: { width: 1, height: 40, background: 'var(--border)', margin: '0 12px' },
  alert: { display: 'flex', alignItems: 'center', gap: 14, background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 14, padding: '14px 16px', marginBottom: 20, cursor: 'pointer' },
  alertIcon: { fontSize: 24, flexShrink: 0 },
  alertTitle: { fontSize: 14, fontWeight: 700, color: '#c4b5fd' },
  alertSub: { fontSize: 12, color: 'var(--text2)', marginTop: 2 },
  alertChevron: { fontSize: 20, color: 'var(--text3)', marginLeft: 'auto' },
  sectionTitle: { fontSize: 18, fontWeight: 800, marginBottom: 14 },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
  toolCard: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 18, cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' },
  toolIcon: { fontSize: 24, width: 48, height: 48, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  toolLabel: { fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 4 },
  toolDesc: { fontSize: 12, color: 'var(--text2)', lineHeight: 1.4 },
};
