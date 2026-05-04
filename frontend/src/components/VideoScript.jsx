import { useState } from 'react';
import { generateScript } from '../utils/ai.js';

const PLATFORMS = ['Instagram Reel', 'TikTok', 'YouTube Short', 'YouTube Long'];
const DURATIONS = ['15', '30', '60', '90', '180', '600'];
const STYLES = ['Educational', 'Entertaining', 'Inspirational', 'Tutorial', 'Storytelling', 'POV / Trend'];

export default function VideoScript({ onNoKey }) {
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState(PLATFORMS[0]);
  const [duration, setDuration] = useState('30');
  const [style, setStyle] = useState(STYLES[0]);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function generate() {
    if (!topic.trim()) return;
    setLoading(true); setResult('');
    try {
      setResult(await generateScript(topic, platform, duration, style));
    } catch (e) {
      if (e.message === 'NO_KEY') return onNoKey();
      setResult('❌ Error: ' + e.message);
    } finally { setLoading(false); }
  }

  function copy() {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const durationLabel = d => d >= 60 ? `${d / 60}min` : `${d}s`;

  return (
    <div className="page fadeIn">
      <div className="section-header">
        <div>
          <h2 className="page-title">🎬 Video Scripts</h2>
          <p className="page-sub">Write viral scripts with hooks & CTAs</p>
        </div>
      </div>

      <div className="card">
        <label className="label">Video topic or idea</label>
        <textarea
          className="input"
          value={topic}
          onChange={e => setTopic(e.target.value)}
          placeholder="e.g. 3 morning habits that doubled my productivity"
          rows={2}
        />

        <label className="label">Platform</label>
        <div className="chip-group">
          {PLATFORMS.map(p => (
            <button key={p} className={`chip ${platform === p ? 'active' : ''}`} onClick={() => setPlatform(p)}>{p}</button>
          ))}
        </div>

        <label className="label">Duration</label>
        <div className="chip-group">
          {DURATIONS.map(d => (
            <button key={d} className={`chip ${duration === d ? 'active' : ''}`} onClick={() => setDuration(d)}>
              {durationLabel(parseInt(d))}
            </button>
          ))}
        </div>

        <label className="label">Content Style</label>
        <div className="chip-group">
          {STYLES.map(st => (
            <button key={st} className={`chip ${style === st ? 'active' : ''}`} onClick={() => setStyle(st)}>{st}</button>
          ))}
        </div>

        <button className="btn-primary" onClick={generate} disabled={loading || !topic.trim()}>
          {loading ? <><span className="spinner" />Writing script...</> : '🎬 Generate Script'}
        </button>
      </div>

      {result && (
        <div className="card fadeIn">
          <div style={s.resultHeader}>
            <span style={s.resultLabel}>Your Script</span>
            <button className={`copy-btn ${copied ? 'success' : ''}`} onClick={copy}>
              {copied ? '✓ Copied' : 'Copy All'}
            </button>
          </div>
          <div className="result-box">{result}</div>
        </div>
      )}
    </div>
  );
}

const s = {
  resultHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  resultLabel: { fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--pink)' },
};
