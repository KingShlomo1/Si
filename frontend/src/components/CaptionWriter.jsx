import { useState } from 'react';
import { suggestHashtags, rewriteCaption } from '../utils/ai.js';

const REWRITES = ['More engaging', 'Shorter', 'Add more emojis', 'More professional', 'More casual', 'Add a story', 'Add a question at the end'];

export default function CaptionWriter({ onNoKey }) {
  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [niche, setNiche] = useState('');
  const [postType, setPostType] = useState('Photo');
  const [loadingTags, setLoadingTags] = useState(false);
  const [loadingRewrite, setLoadingRewrite] = useState(false);
  const [copied, setCopied] = useState(false);

  const full = caption.trim() + (hashtags.trim() ? '\n\n' + hashtags : '');
  const charCount = full.length;

  async function getHashtags() {
    setLoadingTags(true);
    try {
      setHashtags(await suggestHashtags(niche || 'lifestyle', postType, caption));
    } catch (e) {
      if (e.message === 'NO_KEY') return onNoKey();
    } finally { setLoadingTags(false); }
  }

  async function doRewrite(instruction) {
    if (!caption.trim()) return;
    setLoadingRewrite(true);
    try {
      setCaption(await rewriteCaption(caption, instruction));
    } catch (e) {
      if (e.message === 'NO_KEY') return onNoKey();
    } finally { setLoadingRewrite(false); }
  }

  function copy() {
    navigator.clipboard.writeText(full);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="page fadeIn">
      <div className="section-header">
        <div>
          <h2 className="page-title">✏️ Caption Writer</h2>
          <p className="page-sub">Write, refine & export your captions</p>
        </div>
      </div>

      <div className="card">
        <div style={s.labelRow}>
          <label className="label" style={{ margin: 0 }}>Write your caption</label>
          <span style={{ ...s.count, color: charCount > 2200 ? '#f87171' : 'var(--text3)' }}>
            {charCount} / 2200
          </span>
        </div>
        <textarea
          className="input"
          style={{ marginTop: 8, minHeight: 120 }}
          value={caption}
          onChange={e => setCaption(e.target.value)}
          placeholder="Start writing your caption..."
          rows={5}
        />

        {caption.trim() && (
          <>
            <label className="label">AI Rewrite</label>
            <div className="chip-group">
              {REWRITES.map(r => (
                <button
                  key={r}
                  className="chip"
                  disabled={loadingRewrite}
                  onClick={() => doRewrite(r)}
                  style={{ opacity: loadingRewrite ? 0.5 : 1 }}
                >
                  {loadingRewrite ? '...' : r}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="card">
        <label className="label">Your Niche (optional)</label>
        <input
          className="input"
          value={niche}
          onChange={e => setNiche(e.target.value)}
          placeholder="e.g. fitness, travel, food, fashion"
        />

        <label className="label">Post type</label>
        <div className="chip-group">
          {['Photo', 'Reel', 'Carousel', 'Story'].map(p => (
            <button key={p} className={`chip ${postType === p ? 'active' : ''}`} onClick={() => setPostType(p)}>{p}</button>
          ))}
        </div>

        <button className="btn-primary" onClick={getHashtags} disabled={loadingTags || !caption.trim()}>
          {loadingTags ? <><span className="spinner" />Finding hashtags...</> : '🔥 Generate Hashtag Strategy'}
        </button>
      </div>

      {hashtags && (
        <div className="card fadeIn">
          <label className="label">Hashtag Strategy</label>
          <textarea
            className="input"
            value={hashtags}
            onChange={e => setHashtags(e.target.value)}
            rows={6}
          />
        </div>
      )}

      {full.trim() && (
        <>
          <div className="card">
            <div style={s.previewHeader}>
              <span style={s.previewLabel}>Preview</span>
              <button className={`copy-btn ${copied ? 'success' : ''}`} onClick={copy}>
                {copied ? '✓ Copied' : 'Copy All'}
              </button>
            </div>
            <p style={s.previewText}>{full}</p>
          </div>
        </>
      )}
    </div>
  );
}

const s = {
  labelRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  count: { fontSize: 12, fontWeight: 600, transition: 'color 0.2s' },
  previewHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  previewLabel: { fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text2)' },
  previewText: { fontSize: 14, lineHeight: 1.8, color: 'var(--text)', whiteSpace: 'pre-wrap' },
};
