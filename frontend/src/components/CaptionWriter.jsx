import { useState } from 'react';
import { suggestHashtags } from '../utils/ai.js';

export default function CaptionWriter({ onNoKey }) {
  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [loadingTags, setLoadingTags] = useState(false);
  const [copied, setCopied] = useState(false);

  const charCount = caption.length;
  const full = caption + (hashtags ? '\n\n' + hashtags : '');

  async function getHashtags() {
    if (!caption.trim()) return;
    setLoadingTags(true);
    try {
      const tags = await suggestHashtags(caption);
      setHashtags(tags);
    } catch (e) {
      if (e.message === 'NO_KEY') { onNoKey(); return; }
    } finally {
      setLoadingTags(false);
    }
  }

  function copy() {
    navigator.clipboard.writeText(full);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div style={s.page}>
      <h2 style={s.title}>Caption Writer</h2>

      <div style={s.card}>
        <div style={s.labelRow}>
          <label style={s.label}>Write your caption</label>
          <span style={{ ...s.count, ...(charCount > 2200 ? s.countOver : {}) }}>
            {charCount} / 2200
          </span>
        </div>
        <textarea
          value={caption}
          onChange={e => setCaption(e.target.value)}
          placeholder="Write your caption here..."
          style={s.textarea}
          rows={6}
        />

        <button onClick={getHashtags} disabled={loadingTags || !caption.trim()} style={s.secondaryBtn}>
          {loadingTags ? 'Finding hashtags...' : 'Suggest Hashtags with AI'}
        </button>

        {hashtags && (
          <>
            <label style={{ ...s.label, marginTop: 16 }}>Hashtags</label>
            <textarea
              value={hashtags}
              onChange={e => setHashtags(e.target.value)}
              style={{ ...s.textarea, fontSize: 13, color: '#6c63ff' }}
              rows={3}
            />
          </>
        )}

        {full.trim() && (
          <button onClick={copy} style={s.btn}>
            {copied ? 'Copied to clipboard!' : 'Copy Full Caption'}
          </button>
        )}
      </div>

      {full.trim() && (
        <div style={s.preview}>
          <p style={s.previewLabel}>Preview</p>
          <p style={s.previewText}>{full}</p>
        </div>
      )}
    </div>
  );
}

const s = {
  page: { padding: 20, maxWidth: 600, margin: '0 auto' },
  title: { fontSize: 22, fontWeight: 700, marginBottom: 20 },
  card: { background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: 20 },
  labelRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  label: { fontSize: 14, fontWeight: 600, color: '#444' },
  count: { fontSize: 13, color: '#999' },
  countOver: { color: '#e74c3c' },
  textarea: { width: '100%', border: '1px solid #ddd', borderRadius: 10, padding: '12px 14px', fontSize: 15, resize: 'none', outline: 'none', marginBottom: 12 },
  secondaryBtn: { background: '#f0f0f5', color: '#6c63ff', border: 'none', borderRadius: 10, padding: '12px 24px', fontSize: 14, fontWeight: 600, width: '100%', marginBottom: 4 },
  btn: { background: '#6c63ff', color: '#fff', border: 'none', borderRadius: 10, padding: '13px 24px', fontSize: 15, fontWeight: 600, width: '100%', marginTop: 8 },
  preview: { background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  previewLabel: { fontSize: 12, fontWeight: 600, color: '#999', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },
  previewText: { fontSize: 14, lineHeight: 1.7, color: '#333', whiteSpace: 'pre-wrap' },
};
