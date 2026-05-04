import { useState } from 'react';

export default function Settings() {
  const [key, setKey] = useState(localStorage.getItem('anthropic_key') || '');
  const [saved, setSaved] = useState(false);
  const [show, setShow] = useState(false);

  function save() {
    localStorage.setItem('anthropic_key', key.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function clear() {
    localStorage.removeItem('anthropic_key');
    setKey('');
  }

  const hasKey = !!localStorage.getItem('anthropic_key');

  return (
    <div className="page fadeIn">
      <div className="section-header">
        <div>
          <h2 className="page-title">⚙️ Settings</h2>
          <p className="page-sub">Configure your Creator Studio</p>
        </div>
      </div>

      {/* API Key Card */}
      <div className="card card-glow">
        <div style={s.keyHeader}>
          <div style={s.keyIcon}>🔑</div>
          <div>
            <div style={s.keyTitle}>Claude AI API Key</div>
            <div style={s.keySub}>Powers all AI features in this app</div>
          </div>
          <span style={{ ...s.statusDot, background: hasKey ? '#4ade80' : '#f87171' }} />
        </div>

        <div style={s.inputWrap}>
          <input
            className="input"
            type={show ? 'text' : 'password'}
            value={key}
            onChange={e => setKey(e.target.value)}
            placeholder="sk-ant-api03-..."
            style={{ paddingRight: 56 }}
          />
          <button style={s.showBtn} onClick={() => setShow(v => !v)}>{show ? 'Hide' : 'Show'}</button>
        </div>

        <div style={s.btnRow}>
          <button className="btn-primary" style={{ flex: 1, marginTop: 0 }} onClick={save} disabled={!key.trim()}>
            {saved ? '✓ Saved!' : 'Save Key'}
          </button>
          {hasKey && (
            <button className="btn-secondary" onClick={clear} style={{ marginLeft: 10 }}>Remove</button>
          )}
        </div>

        <div style={s.hint}>
          <span style={s.hintIcon}>ℹ️</span>
          <p style={s.hintText}>
            Get a free key at <a href="https://console.anthropic.com" target="_blank" rel="noreferrer" style={s.link}>console.anthropic.com</a>. Your key is stored only on this device and never sent anywhere except the Claude AI API.
          </p>
        </div>
      </div>

      {/* Features list */}
      <div className="card">
        <p style={s.featTitle}>What your key unlocks</p>
        {[
          ['✨', 'AI Caption Generator', 'Scroll-stopping captions in any tone'],
          ['🎬', 'Video Script Studio', 'Viral hooks, scripts & CTAs'],
          ['🔥', 'Hashtag Researcher', 'Tiered hashtag strategies'],
          ['💡', 'Content Ideas', 'Unlimited brainstorming'],
          ['👤', 'Bio Generator', 'Convert visitors to followers'],
          ['✏️', 'AI Caption Rewriter', 'Instantly improve any caption'],
          ['🎨', 'Post Designer AI', 'AI-generated graphic text'],
        ].map(([icon, title, desc]) => (
          <div key={title} style={s.feature}>
            <span style={s.featureIcon}>{icon}</span>
            <div>
              <div style={s.featureTitle}>{title}</div>
              <div style={s.featureDesc}>{desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={s.footer}>
        <p style={s.footerText}>Creator Studio v2.0 · Built with ❤️</p>
      </div>
    </div>
  );
}

const s = {
  keyHeader: { display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 },
  keyIcon: { fontSize: 28, width: 52, height: 52, background: 'rgba(124,58,237,0.15)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  keyTitle: { fontWeight: 700, fontSize: 16 },
  keySub: { fontSize: 12, color: 'var(--text2)', marginTop: 2 },
  statusDot: { width: 10, height: 10, borderRadius: '50%', marginLeft: 'auto', flexShrink: 0 },
  inputWrap: { position: 'relative', marginBottom: 12 },
  showBtn: { position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--purple-light)', fontSize: 12, fontWeight: 600 },
  btnRow: { display: 'flex', alignItems: 'center', marginBottom: 16 },
  hint: { display: 'flex', gap: 10, alignItems: 'flex-start', background: 'rgba(124,58,237,0.08)', borderRadius: 10, padding: '12px 14px' },
  hintIcon: { fontSize: 14, flexShrink: 0 },
  hintText: { fontSize: 12, color: 'var(--text2)', lineHeight: 1.6 },
  link: { color: 'var(--purple-light)', textDecoration: 'none' },
  featTitle: { fontSize: 13, fontWeight: 700, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 },
  feature: { display: 'flex', gap: 14, alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)' },
  featureIcon: { fontSize: 20, width: 40, height: 40, background: 'var(--surface2)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  featureTitle: { fontSize: 14, fontWeight: 600 },
  featureDesc: { fontSize: 12, color: 'var(--text2)', marginTop: 2 },
  footer: { textAlign: 'center', padding: '20px 0 8px' },
  footerText: { fontSize: 12, color: 'var(--text3)' },
};
