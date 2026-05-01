'use client';

import { useState } from 'react';

interface Props {
  endpoint: string;
  body: Record<string, unknown>;
  onResult?: (text: string) => void;
  label?: string;
}

export default function StreamingText({ endpoint, body, onResult, label = 'Generate' }: Props) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [copied, setCopied] = useState(false);

  async function generate() {
    setLoading(true); setText(''); setDone(false);
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) { setText('Error: ' + (await res.text())); setLoading(false); return; }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let full = '';
      while (true) {
        const { done: d, value } = await reader.read();
        if (d) break;
        const chunk = decoder.decode(value);
        full += chunk;
        setText(full);
      }
      setDone(true);
      onResult?.(full);
    } finally { setLoading(false); }
  }

  function copy() {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div>
      <button onClick={generate} disabled={loading}
        className="w-full py-3 rounded-xl font-bold text-sm text-white disabled:opacity-50 transition-all hover:opacity-90"
        style={{ background: 'var(--grad)' }}>
        {loading
          ? <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              Generating...
            </span>
          : `✨ ${label}`}
      </button>

      {text && (
        <div className="mt-4 rounded-xl p-4 relative"
          style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}>
          <pre className="text-sm whitespace-pre-wrap leading-relaxed" style={{ color: 'var(--text)' }}>
            {text}
            {loading && <span className="animate-pulse-slow" style={{ color: 'var(--purple-light)' }}>▋</span>}
          </pre>
          {done && (
            <div className="flex gap-2 mt-3 pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
              <button onClick={copy}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
                style={{ background: copied ? 'rgba(16,185,129,0.15)' : 'var(--surface2)', color: copied ? '#10b981' : 'var(--text2)' }}>
                {copied ? '✓ Copied' : 'Copy'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
