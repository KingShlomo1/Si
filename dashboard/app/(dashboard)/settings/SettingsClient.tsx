'use client';

import { useState } from 'react';
import { updateProfile } from '@/actions/profile';
import type { Profile, BrandVoice } from '@/types';

export default function SettingsClient({ profile, userEmail }: { profile: Profile; userEmail: string }) {
  const [displayName, setDisplayName] = useState(profile?.display_name ?? '');
  const [voice, setVoice] = useState<BrandVoice>(profile?.brand_voice ?? {
    tone: '', audience: '', avoid: '', sample_posts: [], keywords: [],
  });
  const [sampleInput, setSampleInput] = useState('');
  const [keywordInput, setKeywordInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function updateVoice(key: keyof BrandVoice, value: unknown) {
    setVoice(v => ({ ...v, [key]: value }));
  }

  function addSample() {
    if (!sampleInput.trim()) return;
    updateVoice('sample_posts', [...(voice.sample_posts ?? []), sampleInput.trim()]);
    setSampleInput('');
  }

  function removeSample(i: number) {
    updateVoice('sample_posts', voice.sample_posts.filter((_, idx) => idx !== i));
  }

  function addKeyword() {
    const kw = keywordInput.trim();
    if (!kw) return;
    updateVoice('keywords', [...(voice.keywords ?? []), kw]);
    setKeywordInput('');
  }

  async function save() {
    setSaving(true);
    await updateProfile({ display_name: displayName, brand_voice: voice });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="rounded-2xl p-5 mb-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
      <h3 className="font-bold text-sm mb-4" style={{ color: 'var(--text)' }}>{title}</h3>
      {children}
    </div>
  );

  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="mb-4">
      <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text2)' }}>{label}</label>
      {children}
    </div>
  );

  const inputStyle = { background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--text)' };

  return (
    <div>
      {/* Profile */}
      <Section title="Profile">
        <Field label="Display Name">
          <input value={displayName} onChange={e => setDisplayName(e.target.value)}
            placeholder="Your name" className="w-full rounded-xl px-4 py-2.5 text-sm outline-none" style={inputStyle} />
        </Field>
        <Field label="Email">
          <input value={userEmail} disabled className="w-full rounded-xl px-4 py-2.5 text-sm opacity-50 cursor-not-allowed" style={inputStyle} />
        </Field>
      </Section>

      {/* Brand Voice */}
      <Section title="🎙️ Brand Voice">
        <p className="text-xs mb-5" style={{ color: 'var(--text2)' }}>
          This is used by the AI assistant to write all content in your brand&apos;s style.
        </p>

        <Field label="Tone & Personality">
          <textarea value={voice.tone} onChange={e => updateVoice('tone', e.target.value)}
            placeholder="e.g. casual and authentic, never corporate, uses humor occasionally"
            rows={2} className="w-full rounded-xl px-4 py-2.5 text-sm resize-none outline-none" style={inputStyle} />
        </Field>

        <Field label="Target Audience">
          <input value={voice.audience} onChange={e => updateVoice('audience', e.target.value)}
            placeholder="e.g. millennial female entrepreneurs aged 25-40"
            className="w-full rounded-xl px-4 py-2.5 text-sm outline-none" style={inputStyle} />
        </Field>

        <Field label="Always Avoid">
          <input value={voice.avoid} onChange={e => updateVoice('avoid', e.target.value)}
            placeholder="e.g. jargon, exclamation marks, salesy language"
            className="w-full rounded-xl px-4 py-2.5 text-sm outline-none" style={inputStyle} />
        </Field>

        <Field label="Brand Keywords">
          <div className="flex flex-wrap gap-2 mb-2">
            {voice.keywords?.map((kw, i) => (
              <span key={i} className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold"
                style={{ background: 'rgba(124,58,237,0.15)', color: 'var(--purple-light)' }}>
                {kw}
                <button onClick={() => updateVoice('keywords', voice.keywords.filter((_, idx) => idx !== i))}
                  className="opacity-60 hover:opacity-100">×</button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={keywordInput} onChange={e => setKeywordInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addKeyword()}
              placeholder="Add keyword + Enter"
              className="flex-1 rounded-xl px-4 py-2.5 text-sm outline-none" style={inputStyle} />
            <button onClick={addKeyword} className="px-4 py-2.5 rounded-xl text-sm font-bold"
              style={{ background: 'var(--surface2)', color: 'var(--text2)', border: '1px solid var(--border)' }}>
              Add
            </button>
          </div>
        </Field>

        <Field label="Sample Posts (teach the AI your style)">
          <div className="flex flex-col gap-2 mb-2">
            {voice.sample_posts?.map((s, i) => (
              <div key={i} className="flex items-start gap-2 p-3 rounded-xl"
                style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}>
                <p className="flex-1 text-xs leading-relaxed" style={{ color: 'var(--text2)' }}>{s}</p>
                <button onClick={() => removeSample(i)} className="text-xs opacity-50 hover:opacity-100 flex-shrink-0"
                  style={{ color: '#ef4444' }}>×</button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <textarea value={sampleInput} onChange={e => setSampleInput(e.target.value)}
              placeholder="Paste an example post that represents your voice..."
              rows={2} className="flex-1 rounded-xl px-3 py-2.5 text-sm resize-none outline-none" style={inputStyle} />
            <button onClick={addSample} className="px-4 rounded-xl text-sm font-bold self-stretch"
              style={{ background: 'var(--surface2)', color: 'var(--text2)', border: '1px solid var(--border)' }}>
              Add
            </button>
          </div>
        </Field>
      </Section>

      {/* Save */}
      <button onClick={save} disabled={saving}
        className="w-full py-3.5 rounded-xl font-bold text-white text-sm disabled:opacity-50 transition-all hover:opacity-90"
        style={{ background: saved ? 'rgba(16,185,129,0.8)' : 'var(--grad)' }}>
        {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Changes'}
      </button>
    </div>
  );
}
