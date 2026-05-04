import { useState } from 'react';
import { generateCaptions } from '../utils/ai.js';

const TONES = ['Casual & fun', 'Inspirational', 'Professional', 'Funny & witty', 'Aesthetic', 'Educational', 'Storytelling'];
const PLATFORMS = ['Instagram', 'TikTok', 'LinkedIn', 'Twitter/X'];

function CaptionCard({ text, index }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <div className="card fadeIn" style={s.captionCard}>
      <div style={s.cardHeader}>
        <span style={s.cardNum}>Option {index + 1}</span>
        <button className={`copy-btn ${copied ? 'success' : ''}`} onClick={copy}>
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <p style={s.captionText}>{text}</p>
    </div>
  );
}

export default function CaptionGenerator({ onNoKey }) {
  const [desc, setDesc] = useState('');
  const [tone, setTone] = useState(TONES[0]);
  const [platform, setPlatform] = useState(PLATFORMS[0]);
  const [count, setCount] = useState(3);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  async function generate() {
    if (!desc.trim()) return;
    setLoading(true); setResult('');
    try {
      setResult(await generateCaptions(desc, tone, platform, count));
    } catch (e) {
      if (e.message === 'NO_KEY') return onNoKey();
      setResult('❌ Error: ' + e.message);
    } finally { setLoading(false); }
  }

  const captions = result
    ? result.split(/Caption \d+:/i).filter(c => c.trim()).map(c => c.trim())
    : [];

  return (
    <div className="page fadeIn">
      <div className="section-header">
        <div>
          <h2 className="page-title">✨ AI Captions</h2>
          <p className="page-sub">Generate scroll-stopping captions in seconds</p>
        </div>
      </div>

      <div className="card">
        <label className="label">Describe your post</label>
        <textarea
          className="input"
          value={desc}
          onChange={e => setDesc(e.target.value)}
          placeholder="e.g. golden hour selfie at the beach, feeling happy and grateful, summer vibes"
          rows={3}
        />

        <label className="label">Platform</label>
        <div className="chip-group">
          {PLATFORMS.map(p => (
            <button key={p} className={`chip ${platform === p ? 'active' : ''}`} onClick={() => setPlatform(p)}>{p}</button>
          ))}
        </div>

        <label className="label">Tone & Style</label>
        <div className="chip-group">
          {TONES.map(t => (
            <button key={t} className={`chip ${tone === t ? 'active' : ''}`} onClick={() => setTone(t)}>{t}</button>
          ))}
        </div>

        <label className="label">Number of options</label>
        <div className="chip-group">
          {[1, 2, 3, 5].map(n => (
            <button key={n} className={`chip ${count === n ? 'active' : ''}`} onClick={() => setCount(n)}>{n}</button>
          ))}
        </div>

        <button className="btn-primary" onClick={generate} disabled={loading || !desc.trim()}>
          {loading ? <><span className="spinner" />Generating...</> : '✨ Generate Captions'}
        </button>
      </div>

      {captions.length > 0 && (
        <div className="fadeIn">
          {captions.map((cap, i) => <CaptionCard key={i} text={cap} index={i} />)}
        </div>
      )}

      {result && !captions.length && (
        <div className="card"><div className="result-box">{result}</div></div>
      )}
    </div>
  );
}

const s = {
  captionCard: { marginBottom: 12 },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cardNum: { fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--purple-light)' },
  captionText: { fontSize: 14, lineHeight: 1.8, color: 'var(--text)', whiteSpace: 'pre-wrap' },
};
