import { useState } from 'react';

export default function Settings({ onSave }) {
  const [key, setKey] = useState(localStorage.getItem('anthropic_key') || '');
  const [saved, setSaved] = useState(false);

  function save() {
    localStorage.setItem('anthropic_key', key.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    if (onSave) onSave();
  }

  return (
    <div style={s.page}>
      <h2 style={s.title}>Settings</h2>

      <div style={s.card}>
        <h3 style={s.label}>Claude AI API Key</h3>
        <p style={s.hint}>
          Get a free key at{' '}
          <a href="https://console.anthropic.com" target="_blank" rel="noreferrer" style={s.link}>
            console.anthropic.com
          </a>
          . It's stored only on your device.
        </p>
        <input
          type="password"
          value={key}
          onChange={e => setKey(e.target.value)}
          placeholder="sk-ant-..."
          style={s.input}
        />
        <button onClick={save} style={s.btn}>
          {saved ? 'Saved!' : 'Save Key'}
        </button>
      </div>
    </div>
  );
}

const s = {
  page: { padding: 20, maxWidth: 600, margin: '0 auto' },
  title: { fontSize: 22, fontWeight: 700, marginBottom: 20 },
  card: { background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  label: { fontSize: 16, fontWeight: 600, marginBottom: 8 },
  hint: { fontSize: 13, color: '#666', marginBottom: 16, lineHeight: 1.5 },
  link: { color: '#6c63ff' },
  input: { width: '100%', border: '1px solid #ddd', borderRadius: 10, padding: '12px 14px', fontSize: 15, marginBottom: 12, outline: 'none' },
  btn: { background: '#6c63ff', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 24px', fontSize: 15, fontWeight: 600, width: '100%' },
};
