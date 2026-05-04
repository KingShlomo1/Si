import { useState, useEffect } from 'react';
import { load, save } from '../utils/storage.js';

const STORE = 'content_schedule';
const PLATFORMS = ['Instagram', 'TikTok', 'YouTube', 'Twitter/X', 'LinkedIn'];
const TYPES = ['Photo', 'Reel', 'Carousel', 'Story', 'Short', 'Tweet'];
const STATUS_COLORS = { Planned: '#7c3aed', 'In Progress': '#f59e0b', Posted: '#4ade80', Draft: '#6060a0' };
const STATUSES = Object.keys(STATUS_COLORS);

function today() { return new Date().toISOString().slice(0, 10); }

export default function ContentCalendar() {
  const [posts, setPosts] = useState(() => load(STORE));
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [filter, setFilter] = useState('All');
  const [form, setForm] = useState(defaultForm);

  useEffect(() => save(STORE, posts), [posts]);

  function defaultForm() {
    return { date: today(), time: '12:00', platform: 'Instagram', type: 'Photo', caption: '', notes: '', status: 'Planned' };
  }

  function openNew() { setForm(defaultForm()); setEditing(null); setShowForm(true); }

  function openEdit(post) {
    setForm({ ...post });
    setEditing(post.id);
    setShowForm(true);
  }

  function submit() {
    if (!form.caption.trim()) return;
    if (editing) {
      setPosts(p => p.map(x => x.id === editing ? { ...form, id: editing } : x).sort(sortFn));
    } else {
      setPosts(p => [...p, { ...form, id: Date.now() }].sort(sortFn));
    }
    setShowForm(false); setEditing(null);
  }

  function sortFn(a, b) { return (a.date + a.time).localeCompare(b.date + b.time); }

  function deletePost(id) { setPosts(p => p.filter(x => x.id !== id)); }

  function cycleStatus(id) {
    setPosts(p => p.map(x => {
      if (x.id !== id) return x;
      const idx = STATUSES.indexOf(x.status);
      return { ...x, status: STATUSES[(idx + 1) % STATUSES.length] };
    }));
  }

  const visible = filter === 'All' ? posts : posts.filter(p => p.status === filter);
  const counts = STATUSES.reduce((acc, s) => ({ ...acc, [s]: posts.filter(p => p.status === s).length }), {});

  return (
    <div className="page fadeIn">
      <div className="section-header">
        <div>
          <h2 className="page-title">📅 Calendar</h2>
          <p className="page-sub">Plan and track your content pipeline</p>
        </div>
        <button className="btn-secondary" onClick={openNew}>+ Add</button>
      </div>

      {/* Stats bar */}
      <div style={s.statsBar}>
        {STATUSES.map(st => (
          <div key={st} style={s.statItem}>
            <div style={{ ...s.statDot, background: STATUS_COLORS[st] }} />
            <span style={s.statText}>{counts[st] || 0} {st}</span>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="chip-group" style={{ marginBottom: 16 }}>
        {['All', ...STATUSES].map(f => (
          <button key={f} className={`chip ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>

      {/* Add / Edit Form */}
      {showForm && (
        <div className="card card-glow fadeIn" style={{ marginBottom: 20 }}>
          <div style={s.formHeader}>
            <span style={s.formTitle}>{editing ? 'Edit Post' : 'New Post'}</span>
            <button className="btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
          </div>

          <label className="label">Date & Time</label>
          <div style={s.row}>
            <input type="date" className="input" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} style={{ flex: 2 }} />
            <input type="time" className="input" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} style={{ flex: 1 }} />
          </div>

          <label className="label">Platform</label>
          <div className="chip-group">
            {PLATFORMS.map(p => (
              <button key={p} className={`chip ${form.platform === p ? 'active' : ''}`} onClick={() => setForm(f => ({ ...f, platform: p }))}>{p}</button>
            ))}
          </div>

          <label className="label">Content Type</label>
          <div className="chip-group">
            {TYPES.map(t => (
              <button key={t} className={`chip ${form.type === t ? 'active' : ''}`} onClick={() => setForm(f => ({ ...f, type: t }))}>{t}</button>
            ))}
          </div>

          <label className="label">Caption / Description</label>
          <textarea className="input" value={form.caption} onChange={e => setForm(f => ({ ...f, caption: e.target.value }))} placeholder="What's this post about?" rows={3} />

          <label className="label">Notes (optional)</label>
          <input className="input" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Filming location, props, ideas..." />

          <label className="label">Status</label>
          <div className="chip-group">
            {STATUSES.map(st => (
              <button key={st} className={`chip ${form.status === st ? 'active' : ''}`} onClick={() => setForm(f => ({ ...f, status: st }))}>{st}</button>
            ))}
          </div>

          <button className="btn-primary" onClick={submit}>{editing ? 'Save Changes' : 'Add to Calendar'}</button>
        </div>
      )}

      {visible.length === 0 ? (
        <div style={s.empty}>
          <div style={s.emptyIcon}>📅</div>
          <p style={s.emptyText}>No posts {filter !== 'All' ? `with status "${filter}"` : 'scheduled yet'}</p>
          <button className="btn-secondary" onClick={openNew} style={{ marginTop: 12 }}>Plan your first post</button>
        </div>
      ) : (
        <div style={s.list}>
          {visible.map(post => (
            <div key={post.id} className="card" style={s.postCard}>
              <div style={s.postTop}>
                <div style={s.postMeta}>
                  <span style={{ ...s.statusBadge, background: STATUS_COLORS[post.status] + '22', color: STATUS_COLORS[post.status] }}>
                    {post.status}
                  </span>
                  <span style={s.platformTag}>{post.platform}</span>
                  <span style={s.typeTag}>{post.type}</span>
                </div>
                <span style={s.date}>{post.date}<br />{post.time}</span>
              </div>

              <p style={s.postCaption}>{post.caption}</p>
              {post.notes && <p style={s.postNotes}>📌 {post.notes}</p>}

              <div style={s.postActions}>
                <button style={s.actionBtn} onClick={() => cycleStatus(post.id)}>Next Status →</button>
                <button style={s.actionBtn} onClick={() => openEdit(post)}>Edit</button>
                <button style={{ ...s.actionBtn, color: '#f87171' }} onClick={() => deletePost(post.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const s = {
  statsBar: { display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 16, padding: '12px 16px', background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--border)' },
  statItem: { display: 'flex', alignItems: 'center', gap: 6 },
  statDot: { width: 8, height: 8, borderRadius: '50%', flexShrink: 0 },
  statText: { fontSize: 12, color: 'var(--text2)', fontWeight: 600 },
  formHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  formTitle: { fontWeight: 700, fontSize: 16 },
  row: { display: 'flex', gap: 8 },
  empty: { textAlign: 'center', padding: '60px 20px' },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { color: 'var(--text2)', fontSize: 15 },
  list: { display: 'flex', flexDirection: 'column', gap: 12 },
  postCard: { padding: 18 },
  postTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  postMeta: { display: 'flex', flexWrap: 'wrap', gap: 6 },
  statusBadge: { borderRadius: 6, padding: '3px 8px', fontSize: 11, fontWeight: 700 },
  platformTag: { background: 'var(--surface2)', color: 'var(--text2)', borderRadius: 6, padding: '3px 8px', fontSize: 11, fontWeight: 600 },
  typeTag: { background: 'var(--surface2)', color: 'var(--text2)', borderRadius: 6, padding: '3px 8px', fontSize: 11 },
  date: { fontSize: 11, color: 'var(--text3)', textAlign: 'right', lineHeight: 1.6 },
  postCaption: { fontSize: 13, color: 'var(--text)', lineHeight: 1.6, marginBottom: 6 },
  postNotes: { fontSize: 12, color: 'var(--text3)', marginBottom: 12 },
  postActions: { display: 'flex', gap: 16, paddingTop: 12, borderTop: '1px solid var(--border)' },
  actionBtn: { background: 'none', border: 'none', fontSize: 12, color: 'var(--purple-light)', fontWeight: 600, padding: 0 },
};
