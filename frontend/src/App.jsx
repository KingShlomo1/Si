import { useState } from 'react';
import Dashboard from './components/Dashboard.jsx';
import CaptionGenerator from './components/CaptionGenerator.jsx';
import VideoScript from './components/VideoScript.jsx';
import CaptionWriter from './components/CaptionWriter.jsx';
import HashtagResearch from './components/HashtagResearch.jsx';
import ContentIdeas from './components/ContentIdeas.jsx';
import BioGenerator from './components/BioGenerator.jsx';
import PostDesigner from './components/PostDesigner.jsx';
import ContentCalendar from './components/ContentCalendar.jsx';
import Settings from './components/Settings.jsx';

const NAV = [
  { id: 'home',     emoji: '🏠', label: 'Home' },
  { id: 'captions', emoji: '✨', label: 'Captions' },
  { id: 'script',   emoji: '🎬', label: 'Scripts' },
  { id: 'designer', emoji: '🎨', label: 'Design' },
  { id: 'schedule', emoji: '📅', label: 'Calendar' },
];

const ALL_TABS = ['home', 'captions', 'script', 'designer', 'schedule',
                  'write', 'hashtags', 'ideas', 'bio', 'settings'];

export default function App() {
  const [tab, setTab] = useState('home');

  function goToSettings() { setTab('settings'); }

  function renderTab() {
    switch (tab) {
      case 'home':     return <Dashboard onNavigate={setTab} />;
      case 'captions': return <CaptionGenerator onNoKey={goToSettings} />;
      case 'script':   return <VideoScript onNoKey={goToSettings} />;
      case 'write':    return <CaptionWriter onNoKey={goToSettings} />;
      case 'hashtags': return <HashtagResearch onNoKey={goToSettings} />;
      case 'ideas':    return <ContentIdeas onNoKey={goToSettings} />;
      case 'bio':      return <BioGenerator onNoKey={goToSettings} />;
      case 'designer': return <PostDesigner onNoKey={goToSettings} />;
      case 'schedule': return <ContentCalendar />;
      case 'settings': return <Settings />;
      default:         return <Dashboard onNavigate={setTab} />;
    }
  }

  return (
    <div style={s.app}>
      {/* Top bar */}
      <header style={s.header}>
        <div style={s.headerInner}>
          <button
            style={s.logo}
            onClick={() => setTab('home')}
          >
            <span style={s.logoGrad}>Creator Studio</span>
          </button>
          <button
            style={{ ...s.settingsBtn, ...(tab === 'settings' ? s.settingsBtnActive : {}) }}
            onClick={() => setTab('settings')}
            title="Settings"
          >
            ⚙️
          </button>
        </div>

        {/* Breadcrumb for sub-pages */}
        {!NAV.find(n => n.id === tab) && tab !== 'home' && (
          <div style={s.breadcrumb}>
            <button style={s.backBtn} onClick={() => setTab('home')}>‹ Home</button>
            <span style={s.breadCrumbLabel}>{TAB_LABELS[tab]}</span>
          </div>
        )}
      </header>

      {/* Content */}
      <main style={s.main}>
        {renderTab()}
      </main>

      {/* Bottom nav */}
      <nav style={s.nav}>
        {NAV.map(item => (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            style={{ ...s.navBtn, ...(tab === item.id ? s.navBtnActive : {}) }}
          >
            <span style={s.navEmoji}>{item.emoji}</span>
            <span style={s.navLabel}>{item.label}</span>
            {tab === item.id && <span style={s.navDot} />}
          </button>
        ))}
      </nav>
    </div>
  );
}

const TAB_LABELS = {
  write: '✏️ Caption Writer',
  hashtags: '🔥 Hashtag Research',
  ideas: '💡 Content Ideas',
  bio: '👤 Bio Generator',
  settings: '⚙️ Settings',
};

const s = {
  app: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    maxWidth: 680,
    margin: '0 auto',
    position: 'relative',
  },
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    background: 'rgba(15,15,26,0.85)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderBottom: '1px solid var(--border)',
  },
  headerInner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 20px',
  },
  logo: { background: 'none', border: 'none', padding: 0, cursor: 'pointer' },
  logoGrad: {
    fontSize: 18,
    fontWeight: 900,
    letterSpacing: '-0.02em',
    background: 'linear-gradient(135deg,#a78bfa,#ec4899)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  settingsBtn: {
    background: 'none',
    border: 'none',
    fontSize: 20,
    padding: '4px 8px',
    borderRadius: 8,
    opacity: 0.6,
    transition: 'opacity 0.2s',
  },
  settingsBtnActive: { opacity: 1 },
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '6px 20px 10px',
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--purple-light)',
    fontSize: 14,
    fontWeight: 600,
    padding: 0,
    cursor: 'pointer',
  },
  breadCrumbLabel: { fontSize: 13, color: 'var(--text2)' },
  main: { flex: 1, paddingBottom: 80, overflowX: 'hidden' },
  nav: {
    position: 'fixed',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100%',
    maxWidth: 680,
    background: 'rgba(15,15,26,0.92)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderTop: '1px solid var(--border)',
    display: 'flex',
    zIndex: 100,
    paddingBottom: 'env(safe-area-inset-bottom)',
  },
  navBtn: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '10px 4px 10px',
    background: 'none',
    border: 'none',
    color: 'var(--text3)',
    gap: 3,
    position: 'relative',
    transition: 'color 0.2s',
  },
  navBtnActive: { color: 'var(--purple-light)' },
  navEmoji: { fontSize: 22 },
  navLabel: { fontSize: 10, fontWeight: 700, letterSpacing: '0.03em' },
  navDot: {
    position: 'absolute',
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: '50%',
    background: 'var(--purple-light)',
  },
};
