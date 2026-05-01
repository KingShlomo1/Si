'use client';

import { useState } from 'react';
import StreamingText from '@/components/ai/StreamingText';
import PlatformSelector from '@/components/compose/PlatformSelector';
import type { PlatformName } from '@/types';

const TABS = ['Draft Post', 'Draft Reply', 'Content Ideas'] as const;
type Tab = typeof TABS[number];

const GOALS = ['Grow followers', 'Get more saves', 'Drive sales', 'Build community', 'Go viral', 'Educate audience'];
const TONES = ['Casual', 'Professional', 'Inspirational', 'Funny', 'Educational', 'Storytelling'];

export default function AIPage() {
  const [tab, setTab] = useState<Tab>('Draft Post');

  // Draft Post state
  const [description, setDescription] = useState('');
  const [platforms, setPlatforms] = useState<PlatformName[]>([]);
  const [tone, setTone] = useState(TONES[0]);

  // Draft Reply state
  const [comment, setComment] = useState('');
  const [context, setContext] = useState('');

  // Content Ideas state
  const [niche, setNiche] = useState('');
  const [goal, setGoal] = useState(GOALS[0]);
  const [count, setCount] = useState(10);

  return (
    <div className="max-w-2xl mx-auto animate-fade-up">
      <div className="mb-6">
        <h2 className="text-xl font-black" style={{ color: 'var(--text)' }}>✨ AI Assistant</h2>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text2)' }}>Generate content in your brand voice</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 p-1 rounded-2xl" style={{ background: 'var(--surface)' }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all"
            style={{
              background: tab === t ? 'var(--grad)' : 'transparent',
              color: tab === t ? '#fff' : 'var(--text2)',
            }}>
            {t}
          </button>
        ))}
      </div>

      <div className="rounded-2xl p-5 flex flex-col gap-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        {tab === 'Draft Post' && (
          <>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text2)' }}>Describe your post</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)}
                placeholder="e.g. Sharing my morning routine, authentic and relatable"
                rows={3} className="w-full rounded-xl px-4 py-3 text-sm resize-none outline-none"
                style={{ background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--text)' }} />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text2)' }}>Platforms</label>
              <PlatformSelector selected={platforms} onChange={setPlatforms} />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text2)' }}>Tone</label>
              <div className="flex flex-wrap gap-2">
                {TONES.map(t => (
                  <button key={t} onClick={() => setTone(t)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                    style={{ background: tone === t ? 'var(--grad)' : 'var(--surface2)', color: tone === t ? '#fff' : 'var(--text2)', border: tone === t ? 'none' : '1px solid var(--border)' }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <StreamingText endpoint="/api/ai/draft-post" body={{ description, platforms, tone }} label="Draft Caption" />
          </>
        )}

        {tab === 'Draft Reply' && (
          <>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text2)' }}>Comment / Mention to reply to</label>
              <textarea value={comment} onChange={e => setComment(e.target.value)}
                placeholder="Paste the comment or mention here..."
                rows={3} className="w-full rounded-xl px-4 py-3 text-sm resize-none outline-none"
                style={{ background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--text)' }} />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text2)' }}>Context (what was the original post about?)</label>
              <input value={context} onChange={e => setContext(e.target.value)}
                placeholder="e.g. A photo of my new product launch"
                className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                style={{ background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--text)' }} />
            </div>
            <StreamingText endpoint="/api/ai/draft-reply" body={{ comment, context }} label="Draft Reply" />
          </>
        )}

        {tab === 'Content Ideas' && (
          <>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text2)' }}>Your niche</label>
              <input value={niche} onChange={e => setNiche(e.target.value)}
                placeholder="e.g. fitness coaching, plant-based food, travel photography"
                className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                style={{ background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--text)' }} />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text2)' }}>Goal</label>
              <div className="flex flex-wrap gap-2">
                {GOALS.map(g => (
                  <button key={g} onClick={() => setGoal(g)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                    style={{ background: goal === g ? 'var(--grad)' : 'var(--surface2)', color: goal === g ? '#fff' : 'var(--text2)', border: goal === g ? 'none' : '1px solid var(--border)' }}>
                    {g}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text2)' }}>Number of ideas</label>
              <div className="flex gap-2">
                {[5, 10, 15, 20].map(n => (
                  <button key={n} onClick={() => setCount(n)}
                    className="px-4 py-2 rounded-xl text-xs font-bold transition-all"
                    style={{ background: count === n ? 'var(--grad)' : 'var(--surface2)', color: count === n ? '#fff' : 'var(--text2)', border: count === n ? 'none' : '1px solid var(--border)' }}>
                    {n}
                  </button>
                ))}
              </div>
            </div>
            <StreamingText endpoint="/api/ai/content-ideas" body={{ niche, goal, count }} label="Generate Ideas" />
          </>
        )}
      </div>
    </div>
  );
}
