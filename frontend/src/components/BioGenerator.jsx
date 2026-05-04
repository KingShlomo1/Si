import { useState } from 'react';
import { generateBio } from '../utils/ai.js';

const VIBES = ['Professional', 'Creative & fun', 'Aesthetic', 'Motivational', 'Minimalist', 'Humorous'];
const CTAS = ['Visit my link', 'Follow for tips', 'DM for collabs', 'Shop my store', 'Watch my videos', 'Free resource'];

export default function BioGenerator({ onNoKey }) {
  const [name, setName] = useState('');
  const [niche, setNiche] = useState('');
  const [vibe, setVibe] = useState(VIBES[0]);
  const [cta, setCta] = useState(CTAS[0]);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  async function generate() {
    if (!name.trim() || !niche.trim()) return;
    setLoading(true); setResult('');
    try {
      setResult(await generateBio(name, niche, vibe, cta));
    } catch (e) {
      if (e.message === 'NO_KEY') return onNoKey();
      setResult('❌ ' + e.message);
    } finally { setLoading(false); }
  }

  const bios = result
    ? result.split(/Bio \d+:/i).filter(b => b.trim()).map(b => b.trim())
    : [];

  return (
    <div className="page fadeIn">
      <div className="section-header">
        <div>
          <h2 className="page-title">👤 Bio Generator</h2>
          <p className="page-sub">Create a bio that converts visitors to followers</p>
        </div>
      </div>

      <div className="card">
        <label className="label">Your name or handle</label>
        <input className="input" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Sarah or @sarahcreates" />

        <label className="label">What you do / your niche</label>
        <input className="input" value={niche} onChange={e => setNiche(e.target.value)} placeholder="e.g. fitness coach, travel photographer, food blogger" />

        <label className="label">Vibe</label>
        <div className="chip-group">
          {VIBES.map(v => (
            <button key={v} className={`chip ${vibe === v ? 'active' : ''}`} onClick={() => setVibe(v)}>{v}</button>
          ))}
        </div>

        <label className="label">Call to action</label>
        <div className="chip-group">
          {CTAS.map(c => (
            <button key={c} className={`chip ${cta === c ? 'active' : ''}`} onClick={() => setCta(c)}>{c}</button>
          ))}
        </div>

        <button className="btn-primary" onClick={generate} disabled={loading || !name.trim() || !niche.trim()}>
          {loading ? <><span className="spinner" />Creating bios...</> : '👤 Generate Bios'}
        </button>
      </div>

      {bios.length > 0 && (
        <div className="fadeIn">
          {bios.map((bio, i) => <BioCard key={i} bio={bio} index={i} />)}
        </div>
      )}
    </div>
  );
}

function BioCard({ bio, index }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(bio);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <div className="card fadeIn" style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--pink)' }}>
          Option {index + 1}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 11, color: bio.length > 150 ? '#f87171' : 'var(--text3)' }}>{bio.length} chars</span>
          <button className={`copy-btn ${copied ? 'success' : ''}`} onClick={copy}>{copied ? '✓' : 'Copy'}</button>
        </div>
      </div>
      <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--text)', whiteSpace: 'pre-wrap' }}>{bio}</p>
    </div>
  );
}
