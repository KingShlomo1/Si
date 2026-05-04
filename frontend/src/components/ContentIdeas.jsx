import { useState } from 'react';
import { generateIdeas } from '../utils/ai.js';

const GOALS = ['Grow followers', 'Get more saves', 'Drive sales', 'Build community', 'Go viral', 'Educate audience'];
const COUNTS = [5, 10, 15];

export default function ContentIdeas({ onNoKey }) {
  const [niche, setNiche] = useState('');
  const [goal, setGoal] = useState(GOALS[0]);
  const [count, setCount] = useState(10);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState([]);

  async function generate() {
    if (!niche.trim()) return;
    setLoading(true); setResult('');
    try {
      setResult(await generateIdeas(niche, goal, count));
    } catch (e) {
      if (e.message === 'NO_KEY') return onNoKey();
      setResult('❌ ' + e.message);
    } finally { setLoading(false); }
  }

  function saveIdea(idea) {
    if (!saved.includes(idea)) setSaved(prev => [...prev, idea]);
  }

  const ideas = result
    ? result.split(/\n(?=\d+\.)/).filter(Boolean)
    : [];

  return (
    <div className="page fadeIn">
      <div className="section-header">
        <div>
          <h2 className="page-title">💡 Content Ideas</h2>
          <p className="page-sub">Never run out of content again</p>
        </div>
      </div>

      <div className="card">
        <label className="label">Your niche</label>
        <input
          className="input"
          value={niche}
          onChange={e => setNiche(e.target.value)}
          placeholder="e.g. plant-based cooking, gym motivation, budget travel"
        />

        <label className="label">Your goal</label>
        <div className="chip-group">
          {GOALS.map(g => (
            <button key={g} className={`chip ${goal === g ? 'active' : ''}`} onClick={() => setGoal(g)}>{g}</button>
          ))}
        </div>

        <label className="label">Number of ideas</label>
        <div className="chip-group">
          {COUNTS.map(c => (
            <button key={c} className={`chip ${count === c ? 'active' : ''}`} onClick={() => setCount(c)}>{c} ideas</button>
          ))}
        </div>

        <button className="btn-primary" onClick={generate} disabled={loading || !niche.trim()}>
          {loading ? <><span className="spinner" />Brainstorming...</> : '💡 Generate Ideas'}
        </button>
      </div>

      {ideas.length > 0 && (
        <div className="fadeIn">
          {ideas.map((idea, i) => (
            <div key={i} className="card" style={s.ideaCard}>
              <div style={s.ideaContent}>
                <p style={s.ideaText}>{idea.trim()}</p>
              </div>
              <button
                style={{ ...s.saveBtn, ...(saved.includes(idea) ? s.savedBtn : {}) }}
                onClick={() => saveIdea(idea)}
              >
                {saved.includes(idea) ? '✓ Saved' : 'Save'}
              </button>
            </div>
          ))}
        </div>
      )}

      {saved.length > 0 && (
        <div className="card" style={{ marginTop: 8 }}>
          <label className="label">Saved Ideas ({saved.length})</label>
          {saved.map((idea, i) => (
            <div key={i} style={s.savedItem}>
              <span style={s.savedDot} />
              <p style={s.savedText}>{idea.split('\n')[0].trim()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const s = {
  ideaCard: { display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 10 },
  ideaContent: { flex: 1 },
  ideaText: { fontSize: 13, lineHeight: 1.7, color: 'var(--text)', whiteSpace: 'pre-wrap' },
  saveBtn: { flexShrink: 0, background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 600, color: 'var(--text2)', marginTop: 2 },
  savedBtn: { color: '#4ade80', border: '1px solid rgba(74,222,128,0.3)', background: 'rgba(74,222,128,0.08)' },
  savedItem: { display: 'flex', gap: 8, alignItems: 'flex-start', padding: '8px 0', borderBottom: '1px solid var(--border)' },
  savedDot: { width: 6, height: 6, borderRadius: '50%', background: 'var(--purple-light)', marginTop: 6, flexShrink: 0 },
  savedText: { fontSize: 13, color: 'var(--text2)', lineHeight: 1.5 },
};
