import { useState } from 'react';
import { suggestHashtags } from '../utils/ai.js';

const POST_TYPES = ['Photo', 'Reel', 'Carousel', 'Story', 'Collab'];

export default function HashtagResearch({ onNoKey }) {
  const [niche, setNiche] = useState('');
  const [postType, setPostType] = useState('Reel');
  const [caption, setCaption] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function research() {
    if (!niche.trim()) return;
    setLoading(true); setResult('');
    try {
      setResult(await suggestHashtags(niche, postType, caption));
    } catch (e) {
      if (e.message === 'NO_KEY') return onNoKey();
      setResult('❌ ' + e.message);
    } finally { setLoading(false); }
  }

  function copyAll() {
    const tags = result.match(/#\w+/g) || [];
    navigator.clipboard.writeText(tags.join(' '));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const sections = result ? result.split('\n\n').filter(Boolean) : [];

  return (
    <div className="page fadeIn">
      <div className="section-header">
        <div>
          <h2 className="page-title">🔥 Hashtags</h2>
          <p className="page-sub">Full hashtag strategy for every post</p>
        </div>
      </div>

      <div className="card">
        <label className="label">Your niche</label>
        <input
          className="input"
          value={niche}
          onChange={e => setNiche(e.target.value)}
          placeholder="e.g. fitness, travel photography, skincare"
        />

        <label className="label">Post type</label>
        <div className="chip-group">
          {POST_TYPES.map(p => (
            <button key={p} className={`chip ${postType === p ? 'active' : ''}`} onClick={() => setPostType(p)}>{p}</button>
          ))}
        </div>

        <label className="label">Caption snippet (optional – improves accuracy)</label>
        <textarea
          className="input"
          value={caption}
          onChange={e => setCaption(e.target.value)}
          placeholder="Paste a few lines of your caption..."
          rows={2}
        />

        <button className="btn-primary" onClick={research} disabled={loading || !niche.trim()}>
          {loading ? <><span className="spinner" />Researching...</> : '🔥 Generate Strategy'}
        </button>
      </div>

      {sections.length > 0 && (
        <div className="fadeIn">
          <div style={s.resultHeader}>
            <span style={s.resultLabel}>Hashtag Strategy</span>
            <button className={`copy-btn ${copied ? 'success' : ''}`} onClick={copyAll}>
              {copied ? '✓ Copied' : 'Copy All Tags'}
            </button>
          </div>
          {sections.map((section, i) => (
            <div key={i} className="card" style={{ marginBottom: 10 }}>
              <div className="result-box" style={{ marginTop: 0 }}>{section}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const s = {
  resultHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, paddingBottom: 4 },
  resultLabel: { fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text2)' },
};
