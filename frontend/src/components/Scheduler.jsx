import { useState, useEffect } from 'react';

const STORE_KEY = 'content_schedule';

function loadPosts() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY)) || []; }
  catch { return []; }
}

function savePosts(posts) {
  localStorage.setItem(STORE_KEY, JSON.stringify(posts));
}

export default function Scheduler() {
  const [posts, setPosts] = useState(loadPosts);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ date: '', time: '12:00', platform: 'Instagram', caption: '', status: 'Planned' });

  useEffect(() => savePosts(posts), [posts]);

  function addPost() {
    if (!form.date || !form.caption.trim()) return;
    setPosts(prev => [...prev, { ...form, id: Date.now() }].sort((a, b) => a.date.localeCompare(b.date)));
    setForm({ date: '', time: '12:00', platform: 'Instagram', caption: '', status: 'Planned' });
    setShowForm(false);
  }

  function deletePost(id) {
    setPosts(prev => prev.filter(p => p.id !== id));
  }

  function toggleStatus(id) {
    setPosts(prev => prev.map(p =>
      p.id === id ? { ...p, status: p.status === 'Planned' ? 'Posted' : 'Planned' } : p
    ));
  }

  const statusColor = { Planned: '#6c63ff', Posted: '#27ae60' };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h2 style={s.title}>Post Scheduler</h2>
        <button onClick={() => setShowForm(v => !v)} style={s.addBtn}>
          {showForm ? 'Cancel' : '+ Add Post'}
        </button>
      </div>

      {showForm && (
        <div style={s.card}>
          <label style={s.label}>Date</label>
          <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} style={s.input} />

          <label style={s.label}>Time</label>
          <input type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} style={s.input} />

          <label style={s.label}>Platform</label>
          <select value={form.platform} onChange={e => setForm(f => ({ ...f, platform: e.target.value }))} style={s.input}>
            {['Instagram', 'TikTok', 'YouTube', 'Twitter'].map(p => <option key={p}>{p}</option>)}
          </select>

          <label style={s.label}>Caption / Notes</label>
          <textarea
            value={form.caption}
            onChange={e => setForm(f => ({ ...f, caption: e.target.value }))}
            placeholder="Caption or notes for this post..."
            style={s.textarea}
            rows={3}
          />

          <button onClick={addPost} style={s.btn}>Add to Schedule</button>
        </div>
      )}

      {posts.length === 0 && !showForm && (
        <div style={s.empty}>No posts scheduled yet. Tap "+ Add Post" to start.</div>
      )}

      <div style={s.list}>
        {posts.map(post => (
          <div key={post.id} style={s.postCard}>
            <div style={s.postTop}>
              <div>
                <span style={{ ...s.statusBadge, background: statusColor[post.status] || '#999' }}>
                  {post.status}
                </span>
                <span style={s.platform}>{post.platform}</span>
              </div>
              <span style={s.date}>{post.date} {post.time}</span>
            </div>
            <p style={s.postCaption}>{post.caption}</p>
            <div style={s.postActions}>
              <button onClick={() => toggleStatus(post.id)} style={s.actionBtn}>
                {post.status === 'Planned' ? 'Mark Posted' : 'Mark Planned'}
              </button>
              <button onClick={() => deletePost(post.id)} style={{ ...s.actionBtn, color: '#e74c3c' }}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const s = {
  page: { padding: 20, maxWidth: 600, margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 22, fontWeight: 700 },
  addBtn: { background: '#6c63ff', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 18px', fontSize: 14, fontWeight: 600 },
  card: { background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: 20 },
  label: { display: 'block', fontSize: 13, fontWeight: 600, color: '#444', marginBottom: 6, marginTop: 12 },
  input: { width: '100%', border: '1px solid #ddd', borderRadius: 10, padding: '11px 14px', fontSize: 15, outline: 'none' },
  textarea: { width: '100%', border: '1px solid #ddd', borderRadius: 10, padding: '12px 14px', fontSize: 15, resize: 'none', outline: 'none', marginBottom: 4 },
  btn: { background: '#6c63ff', color: '#fff', border: 'none', borderRadius: 10, padding: '13px 24px', fontSize: 15, fontWeight: 600, width: '100%', marginTop: 12 },
  empty: { textAlign: 'center', color: '#999', padding: '60px 0', fontSize: 15 },
  list: { display: 'flex', flexDirection: 'column', gap: 12 },
  postCard: { background: '#fff', borderRadius: 16, padding: 18, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  postTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  statusBadge: { color: '#fff', borderRadius: 6, padding: '3px 8px', fontSize: 12, fontWeight: 600, marginRight: 8 },
  platform: { fontSize: 13, color: '#666' },
  date: { fontSize: 13, color: '#999' },
  postCaption: { fontSize: 14, color: '#333', lineHeight: 1.6, marginBottom: 12 },
  postActions: { display: 'flex', gap: 12 },
  actionBtn: { background: 'none', border: 'none', fontSize: 13, color: '#6c63ff', fontWeight: 600, padding: 0 },
};
