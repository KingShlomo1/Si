'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import type { PlatformName } from '@/types';
import { PLATFORM_LABELS } from '@/types';

interface Props {
  platform: PlatformName;
  onConnect: (username: string) => Promise<void>;
  onClose: () => void;
}

export default function ConnectModal({ platform, onConnect, onClose }: Props) {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim()) return;
    setLoading(true);
    await onConnect(username.trim().replace('@', ''));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
      <div className="w-full max-w-sm rounded-2xl p-6 animate-fade-up"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-base" style={{ color: 'var(--text)' }}>
            Connect {PLATFORM_LABELS[platform]}
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:opacity-70 transition-all"
            style={{ background: 'var(--surface2)', color: 'var(--text2)' }}>
            <X size={14} />
          </button>
        </div>

        <form onSubmit={submit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text2)' }}>
              Your {PLATFORM_LABELS[platform]} Username
            </label>
            <input
              autoFocus value={username} onChange={e => setUsername(e.target.value)}
              placeholder="@username"
              className="w-full rounded-xl px-4 py-3 text-sm outline-none"
              style={{ background: 'var(--bg2)', border: '1px solid var(--border2)', color: 'var(--text)' }}
            />
          </div>

          <div className="p-3 rounded-xl text-xs" style={{ background: 'rgba(124,58,237,0.08)', color: 'var(--text2)' }}>
            ℹ️ This creates a placeholder connection. Full OAuth integration coming soon.
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
              style={{ background: 'var(--surface2)', color: 'var(--text2)', border: '1px solid var(--border)' }}>
              Cancel
            </button>
            <button type="submit" disabled={loading || !username.trim()}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-50"
              style={{ background: 'var(--grad)' }}>
              {loading ? 'Connecting...' : 'Connect'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
