import { useState, useRef } from 'react';
import { generatePostText } from '../utils/ai.js';

const TEMPLATES = [
  { id: 'quote', label: 'Quote', bg: 'linear-gradient(135deg,#7c3aed,#ec4899)', textColor: '#fff', accent: 'rgba(255,255,255,0.15)' },
  { id: 'minimal', label: 'Minimal', bg: '#0f0f1a', textColor: '#fff', accent: 'rgba(124,58,237,0.3)' },
  { id: 'bold', label: 'Bold', bg: '#ec4899', textColor: '#fff', accent: 'rgba(255,255,255,0.2)' },
  { id: 'gold', label: 'Luxury', bg: 'linear-gradient(135deg,#1a1a2e,#2d2417)', textColor: '#f5c842', accent: 'rgba(245,200,66,0.15)' },
  { id: 'ocean', label: 'Ocean', bg: 'linear-gradient(135deg,#0f2027,#203a43,#2c5364)', textColor: '#e0f7ff', accent: 'rgba(224,247,255,0.1)' },
  { id: 'sunset', label: 'Sunset', bg: 'linear-gradient(135deg,#f7971e,#ffd200)', textColor: '#1a1a2e', accent: 'rgba(26,26,46,0.15)' },
  { id: 'forest', label: 'Forest', bg: 'linear-gradient(135deg,#11998e,#38ef7d)', textColor: '#fff', accent: 'rgba(255,255,255,0.15)' },
  { id: 'night', label: 'Night', bg: 'linear-gradient(135deg,#141e30,#243b55)', textColor: '#a5b4fc', accent: 'rgba(165,180,252,0.1)' },
];

const FONTS = ['SF Pro', 'Georgia', 'Helvetica', 'Courier New', 'Impact'];
const SIZES = ['Small', 'Medium', 'Large', 'XL'];
const FONT_SIZE_MAP = { Small: 22, Medium: 30, Large: 40, XL: 52 };

export default function PostDesigner({ onNoKey }) {
  const [template, setTemplate] = useState(TEMPLATES[0]);
  const [mainText, setMainText] = useState('');
  const [subText, setSubText] = useState('');
  const [handle, setHandle] = useState('');
  const [font, setFont] = useState(FONTS[0]);
  const [size, setSize] = useState('Medium');
  const [generating, setGenerating] = useState(false);
  const [exporting, setExporting] = useState(false);
  const previewRef = useRef(null);

  async function aiGenerate() {
    if (!mainText.trim()) return;
    setGenerating(true);
    try {
      const text = await generatePostText(template.id, mainText);
      setMainText(text.trim());
    } catch (e) {
      if (e.message === 'NO_KEY') return onNoKey();
    } finally { setGenerating(false); }
  }

  async function exportImage() {
    if (!previewRef.current) return;
    setExporting(true);
    try {
      const { default: html2canvas } = await import('html2canvas');
      const canvas = await html2canvas(previewRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: null,
        logging: false,
      });
      const link = document.createElement('a');
      link.download = 'creator-studio-post.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } finally { setExporting(false); }
  }

  const fontSize = FONT_SIZE_MAP[size];

  return (
    <div className="page fadeIn">
      <div className="section-header">
        <div>
          <h2 className="page-title">🎨 Post Designer</h2>
          <p className="page-sub">Design and export professional posts</p>
        </div>
      </div>

      {/* Live Preview */}
      <div style={s.previewWrap}>
        <div
          ref={previewRef}
          style={{
            ...s.canvas,
            background: template.bg,
            fontFamily: font + ', sans-serif',
          }}
        >
          <div style={{ ...s.accentCircle, background: template.accent }} />
          <div style={{ ...s.accentCircle2, background: template.accent }} />

          {mainText ? (
            <div style={s.textBlock}>
              <p style={{ ...s.mainText, fontSize, color: template.textColor }}>
                {mainText}
              </p>
              {subText && (
                <p style={{ ...s.subText, color: template.textColor + 'cc' }}>{subText}</p>
              )}
              {handle && (
                <p style={{ ...s.handle, color: template.textColor + '88' }}>@{handle.replace('@', '')}</p>
              )}
            </div>
          ) : (
            <p style={{ ...s.placeholder, color: template.textColor + '44' }}>Your text appears here</p>
          )}
        </div>
        <p style={s.previewNote}>1:1 square — Instagram ready</p>
      </div>

      {/* Controls */}
      <div className="card">
        <label className="label">Template</label>
        <div style={s.templateGrid}>
          {TEMPLATES.map(t => (
            <button
              key={t.id}
              onClick={() => setTemplate(t)}
              style={{
                ...s.templateBtn,
                background: t.bg,
                boxShadow: template.id === t.id ? '0 0 0 3px #7c3aed, 0 0 0 5px rgba(124,58,237,0.3)' : 'none',
              }}
            >
              <span style={{ fontSize: 10, color: t.textColor, fontWeight: 700 }}>{t.label}</span>
            </button>
          ))}
        </div>

        <label className="label">Main text</label>
        <div style={{ position: 'relative' }}>
          <textarea
            className="input"
            value={mainText}
            onChange={e => setMainText(e.target.value)}
            placeholder="Your headline or quote..."
            rows={2}
          />
          <button
            style={s.aiBtn}
            onClick={aiGenerate}
            disabled={generating || !mainText.trim()}
            title="Rewrite with AI"
          >
            {generating ? '...' : '✨ AI'}
          </button>
        </div>

        <label className="label">Subtitle (optional)</label>
        <input className="input" value={subText} onChange={e => setSubText(e.target.value)} placeholder="Supporting text or tagline" />

        <label className="label">Handle (optional)</label>
        <input className="input" value={handle} onChange={e => setHandle(e.target.value)} placeholder="@yourhandle" />

        <label className="label">Font</label>
        <div className="chip-group">
          {FONTS.map(f => (
            <button key={f} className={`chip ${font === f ? 'active' : ''}`} onClick={() => setFont(f)} style={{ fontFamily: f }}>{f}</button>
          ))}
        </div>

        <label className="label">Text size</label>
        <div className="chip-group">
          {SIZES.map(sz => (
            <button key={sz} className={`chip ${size === sz ? 'active' : ''}`} onClick={() => setSize(sz)}>{sz}</button>
          ))}
        </div>

        <button className="btn-primary" onClick={exportImage} disabled={exporting || !mainText.trim()}>
          {exporting ? <><span className="spinner" />Exporting...</> : '⬇️ Export as PNG'}
        </button>
      </div>
    </div>
  );
}

const s = {
  previewWrap: { marginBottom: 20, textAlign: 'center' },
  canvas: {
    width: '100%',
    aspectRatio: '1',
    borderRadius: 20,
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  accentCircle: { position: 'absolute', width: '60%', height: '60%', borderRadius: '50%', top: '-20%', right: '-20%' },
  accentCircle2: { position: 'absolute', width: '40%', height: '40%', borderRadius: '50%', bottom: '-10%', left: '-10%' },
  textBlock: { position: 'relative', zIndex: 1, textAlign: 'center', width: '100%' },
  mainText: { fontWeight: 900, lineHeight: 1.2, letterSpacing: '-0.02em', wordBreak: 'break-word' },
  subText: { fontSize: 16, marginTop: 12, fontWeight: 400, letterSpacing: '0.02em' },
  handle: { fontSize: 13, marginTop: 16, fontWeight: 500, letterSpacing: '0.05em' },
  placeholder: { fontSize: 18, position: 'relative', zIndex: 1, textAlign: 'center', fontStyle: 'italic' },
  previewNote: { fontSize: 11, color: 'var(--text3)', marginTop: 8 },
  templateGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 },
  templateBtn: { aspectRatio: '1', borderRadius: 10, border: 'none', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: '6px 4px', cursor: 'pointer', transition: 'box-shadow 0.2s' },
  aiBtn: { position: 'absolute', right: 10, bottom: 18, background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.4)', borderRadius: 8, padding: '5px 10px', fontSize: 12, color: '#a78bfa', fontWeight: 700, cursor: 'pointer' },
};
