import { useState } from 'react';
import CaptionGenerator from './components/CaptionGenerator.jsx';
import VideoScript from './components/VideoScript.jsx';
import CaptionWriter from './components/CaptionWriter.jsx';
import Scheduler from './components/Scheduler.jsx';
import Settings from './components/Settings.jsx';

const TABS = [
  { id: 'captions', label: '✨ Captions', emoji: '✨' },
  { id: 'script',   label: '🎬 Scripts',  emoji: '🎬' },
  { id: 'write',    label: '✏️ Write',    emoji: '✏️' },
  { id: 'schedule', label: '📅 Schedule', emoji: '📅' },
  { id: 'settings', label: '⚙️ Settings', emoji: '⚙️' },
];

export default function App() {
  const [tab, setTab] = useState('captions');

  function goToSettings() { setTab('settings'); }

  return (
    <div style={s.app}>
      <header style={s.header}>
        <h1 style={s.brand}>Creator Studio</h1>
      </header>

      <main style={s.main}>
        {tab === 'captions'  && <CaptionGenerator onNoKey={goToSettings} />}
        {tab === 'script'    && <VideoScript onNoKey={goToSettings} />}
        {tab === 'write'     && <CaptionWriter onNoKey={goToSettings} />}
        {tab === 'schedule'  && <Scheduler />}
        {tab === 'settings'  && <Settings />}
      </main>

      <nav style={s.nav}>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{ ...s.navBtn, ...(tab === t.id ? s.navBtnActive : {}) }}
          >
            <span style={s.navEmoji}>{t.emoji}</span>
            <span style={s.navLabel}>{t.id.charAt(0).toUpperCase() + t.id.slice(1)}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

const s = {
  app: { display: 'flex', flexDirection: 'column', minHeight: '100vh', maxWidth: 640, margin: '0 auto' },
  header: { background: '#fff', borderBottom: '1px solid #eee', padding: '14px 20px', position: 'sticky', top: 0, zIndex: 10 },
  brand: { fontSize: 18, fontWeight: 700, background: 'linear-gradient(135deg,#6c63ff,#e91e8c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  main: { flex: 1, paddingBottom: 80 },
  nav: { position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 640, background: '#fff', borderTop: '1px solid #eee', display: 'flex', zIndex: 10 },
  navBtn: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 4px 12px', background: 'none', border: 'none', color: '#aaa', gap: 2 },
  navBtnActive: { color: '#6c63ff' },
  navEmoji: { fontSize: 20 },
  navLabel: { fontSize: 10, fontWeight: 600 },
};
