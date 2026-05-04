'use client';

import { useState } from 'react';
import { Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import StreamingText from '@/components/ai/StreamingText';
import type { PlatformName } from '@/types';

interface Props {
  platforms: PlatformName[];
  onUseText: (text: string) => void;
}

export default function AISidePanel({ platforms, onUseText }: Props) {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [tone, setTone] = useState('casual and engaging');
  const [lastResult, setLastResult] = useState('');

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--surface)', border: '1px solid rgba(124,58,237,0.3)' }}>
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-5 py-4"
        style={{ color: 'var(--text)' }}
      >
        <div className="flex items-center gap-2">
          <Sparkles size={16} style={{ color: 'var(--purple-light)' }} />
          <span className="font-bold text-sm">AI Draft Assistant</span>
        </div>
        {open ? <ChevronUp size={16} style={{ color: 'var(--text2)' }} /> : <ChevronDown size={16} style={{ color: 'var(--text2)' }} />}
      </button>

      {open && (
        <div className="px-5 pb-5 flex flex-col gap-4 border-t" style={{ borderColor: 'var(--border)' }}>
          <div className="pt-4">
            <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text2)' }}>
              Describe the post
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="e.g. Announcing our new product launch, excited tone"
              rows={2}
              className="w-full rounded-xl px-3 py-2.5 text-sm resize-none outline-none"
              style={{ background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--text)' }}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text2)' }}>Tone</label>
            <input
              value={tone} onChange={e => setTone(e.target.value)}
              placeholder="e.g. professional, fun, inspiring"
              className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
              style={{ background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--text)' }}
            />
          </div>

          <StreamingText
            endpoint="/api/ai/draft-post"
            body={{ description, platforms, tone }}
            label="Draft Caption"
            onResult={setLastResult}
          />

          {lastResult && (
            <button
              onClick={() => onUseText(lastResult)}
              className="w-full py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-80"
              style={{ background: 'rgba(124,58,237,0.15)', color: 'var(--purple-light)', border: '1px solid rgba(124,58,237,0.3)' }}>
              ← Use This Draft
            </button>
          )}
        </div>
      )}
    </div>
  );
}
