import { useState } from 'react';
import { generateCaptions } from '../utils/ai.js';

const TONES = ['Casual & fun', 'Professional', 'Inspirational', 'Funny & witty', 'Aesthetic'];

export default function CaptionGenerator({ onNoKey }) {
  const [desc, setDesc] = useState('');
  const [tone, setTone] = useState(TONES[0]);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(null);

  async function generate() {
    if (!desc.trim()) return;
    setLoading(true);
    setResult('');
    try {
      const text = await generateCaptions(desc, tone);
      setResult(text);
    } catch (e) {
      if (e.message === 'NO_KEY') { onNoKey(); return; }
      setResult('Error: ' + e.message);
    } finally {
      setLoading(false);
    }
  }

  function copyCaption(text) {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  }

  const captions = result
    ? result.split(/Caption \d+:/i).filter(Boolean).map(c => c.trim())
    : [];

  return (
    <div style={s.page}>
      <h2 style={s.title}>AI Caption Generator</h2>

      <div style={s.card}>
        <label style={s.label}>Describe your post</label>
        <textarea
          value={desc}
          onChange={e => setDesc(e.target.value)}
          placeholder="e.g. sunset photo at the beach with friends, golden hour vibes"
          style={s.textarea}
          rows={3}
        />

        <label style={s.label}>Tone</label>
        <div style={s.tones}>
          {TONES.map(t => (
            <button
              key={t}
              onClick={() => setTone(t)}
              style={{ ...s.toneBtn, ...(tone === t ? s.toneBtnActive : {}) }}
            >
              {t}
            </button>
          ))}
        </div>

        <button onClick={generate} disabled={loading || !desc.trim()} style={s.btn}>
          {loading ? 'Generating...' : 'Generate Captions'}
        </button>
      </div>

      {captions.length > 0 && (
        <div style={s.results}>
          {captions.map((cap, i) => (
            <div key={i} style={s.captionCard}>
              <div style={s.captionHeader}>
                <span style={s.captionNum}>Caption {i + 1}</span>
                <button onClick={() => copyCaption(cap)} style={s.copyBtn}>
                  {copied === cap ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <p style={s.captionText}>{cap}</p>
            </div>
          ))}
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
  tones: { display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  toneBtn: { border: '1px solid #ddd', borderRadius: 20, padding: '7px 14px', fontSize: 13, background: '#fff', color: '#555' },
  toneBtnActive: { background: '#6c63ff', color: '#fff', border: '1px solid #6c63ff' },
  btn: { background: '#6c63ff', color: '#fff', border: 'none', borderRadius: 10, padding: '13px 24px', fontSize: 15, fontWeight: 600, width: '100%', opacity: 1 },
  results: { display: 'flex', flexDirection: 'column', gap: 16 },
  captionCard: { background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  captionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  captionNum: { fontWeight: 600, color: '#6c63ff' },
  copyBtn: { background: '#f0f0f5', border: 'none', borderRadius: 8, padding: '6px 12px', fontSize: 13, fontWeight: 500 },
  captionText: { fontSize: 14, lineHeight: 1.7, color: '#333', whiteSpace: 'pre-wrap' },
};
