import { useState } from 'react';
import { generateScript } from '../utils/ai.js';

const PLATFORMS = ['Instagram Reel', 'YouTube Short', 'TikTok'];
const DURATIONS = ['15', '30', '60', '90'];

export default function VideoScript({ onNoKey }) {
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState(PLATFORMS[0]);
  const [duration, setDuration] = useState('30');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function generate() {
    if (!topic.trim()) return;
    setLoading(true);
    setResult('');
    try {
      const text = await generateScript(topic, platform, duration);
      setResult(text);
    } catch (e) {
      if (e.message === 'NO_KEY') { onNoKey(); return; }
      setResult('Error: ' + e.message);
    } finally {
      setLoading(false);
    }
  }

  function copy() {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div style={s.page}>
      <h2 style={s.title}>Video Script Generator</h2>

      <div style={s.card}>
        <label style={s.label}>Video topic</label>
        <textarea
          value={topic}
          onChange={e => setTopic(e.target.value)}
          placeholder="e.g. 5 morning habits that changed my life"
          style={s.textarea}
          rows={2}
        />

        <label style={s.label}>Platform</label>
        <div style={s.row}>
          {PLATFORMS.map(p => (
            <button
              key={p}
              onClick={() => setPlatform(p)}
              style={{ ...s.chip, ...(platform === p ? s.chipActive : {}) }}
            >
              {p}
            </button>
          ))}
        </div>

        <label style={s.label}>Duration (seconds)</label>
        <div style={{ ...s.row, marginBottom: 20 }}>
          {DURATIONS.map(d => (
            <button
              key={d}
              onClick={() => setDuration(d)}
              style={{ ...s.chip, ...(duration === d ? s.chipActive : {}) }}
            >
              {d}s
            </button>
          ))}
        </div>

        <button onClick={generate} disabled={loading || !topic.trim()} style={s.btn}>
          {loading ? 'Writing script...' : 'Generate Script'}
        </button>
      </div>

      {result && (
        <div style={s.resultCard}>
          <div style={s.resultHeader}>
            <span style={s.resultLabel}>Your Script</span>
            <button onClick={copy} style={s.copyBtn}>{copied ? 'Copied!' : 'Copy'}</button>
          </div>
          <pre style={s.pre}>{result}</pre>
        </div>
      )}
    </div>
  );
}

const s = {
  page: { padding: 20, maxWidth: 600, margin: '0 auto' },
  title: { fontSize: 22, fontWeight: 700, marginBottom: 20 },
  card: { background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: 20 },
  label: { display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8, color: '#444' },
  textarea: { width: '100%', border: '1px solid #ddd', borderRadius: 10, padding: '12px 14px', fontSize: 15, resize: 'none', outline: 'none', marginBottom: 16 },
  row: { display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  chip: { border: '1px solid #ddd', borderRadius: 20, padding: '7px 14px', fontSize: 13, background: '#fff', color: '#555' },
  chipActive: { background: '#6c63ff', color: '#fff', border: '1px solid #6c63ff' },
  btn: { background: '#6c63ff', color: '#fff', border: 'none', borderRadius: 10, padding: '13px 24px', fontSize: 15, fontWeight: 600, width: '100%' },
  resultCard: { background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  resultHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  resultLabel: { fontWeight: 600, color: '#6c63ff' },
  copyBtn: { background: '#f0f0f5', border: 'none', borderRadius: 8, padding: '6px 12px', fontSize: 13, fontWeight: 500 },
  pre: { fontSize: 14, lineHeight: 1.8, color: '#333', whiteSpace: 'pre-wrap', fontFamily: 'inherit' },
};
