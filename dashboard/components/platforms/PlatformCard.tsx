'use client';

import { useState } from 'react';
import { CheckCircle, Plus, Unlink } from 'lucide-react';
import type { ConnectedPlatform, PlatformName } from '@/types';
import { PLATFORM_LABELS } from '@/types';
import ConnectModal from './ConnectModal';

const ICONS: Record<PlatformName, string> = {
  twitter_x: '𝕏', instagram: '📷', linkedin: 'in', tiktok: '♪', facebook: 'f',
};
const COLORS: Record<PlatformName, string> = {
  twitter_x: '#1d9bf0', instagram: '#e1306c', linkedin: '#0077b5', tiktok: '#ff0050', facebook: '#1877f2',
};

interface Props {
  platform: PlatformName;
  connection: ConnectedPlatform | null;
  onConnect: (platform: PlatformName, username: string) => Promise<void>;
  onDisconnect: (id: string) => Promise<void>;
}

export default function PlatformCard({ platform, connection, onConnect, onDisconnect }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const color = COLORS[platform];

  async function handleConnect(username: string) {
    setLoading(true);
    await onConnect(platform, username);
    setLoading(false);
    setShowModal(false);
  }

  async function handleDisconnect() {
    if (!connection) return;
    setLoading(true);
    await onDisconnect(connection.id);
    setLoading(false);
  }

  return (
    <>
      <div className="rounded-2xl p-5 flex flex-col gap-4 transition-all"
        style={{ background: 'var(--surface)', border: `1px solid ${connection ? color + '33' : 'var(--border)'}` }}>

        {/* Icon + status */}
        <div className="flex items-center justify-between">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-black"
            style={{ background: color + '22', color }}>
            {ICONS[platform]}
          </div>
          {connection
            ? <span className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg"
                style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981' }}>
                <CheckCircle size={11} /> Connected
              </span>
            : <span className="text-xs font-semibold px-2 py-1 rounded-lg"
                style={{ background: 'var(--surface2)', color: 'var(--text3)' }}>
                Not connected
              </span>
          }
        </div>

        {/* Name + username */}
        <div>
          <div className="font-bold text-sm mb-0.5" style={{ color: 'var(--text)' }}>{PLATFORM_LABELS[platform]}</div>
          {connection?.platform_username && (
            <div className="text-xs" style={{ color: 'var(--text2)' }}>@{connection.platform_username}</div>
          )}
        </div>

        {/* Action */}
        {connection
          ? <button onClick={handleDisconnect} disabled={loading}
              className="flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all hover:opacity-80 disabled:opacity-50"
              style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>
              <Unlink size={12} /> {loading ? 'Disconnecting...' : 'Disconnect'}
            </button>
          : <button onClick={() => setShowModal(true)} disabled={loading}
              className="flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90"
              style={{ background: color }}>
              <Plus size={12} /> {loading ? 'Connecting...' : 'Connect'}
            </button>
        }
      </div>

      {showModal && (
        <ConnectModal
          platform={platform}
          onConnect={handleConnect}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
