'use client';

import { useState } from 'react';
import PlatformCard from '@/components/platforms/PlatformCard';
import { connectPlatform, disconnectPlatform } from '@/actions/platforms';
import type { ConnectedPlatform, PlatformName } from '@/types';

interface Props {
  platforms: PlatformName[];
  connectionMap: Record<PlatformName, ConnectedPlatform | null>;
}

export default function PlatformsClient({ platforms, connectionMap: initialMap }: Props) {
  const [map, setMap] = useState(initialMap);

  async function handleConnect(platform: PlatformName, username: string) {
    const result = await connectPlatform(platform, username);
    if (result) setMap(m => ({ ...m, [platform]: result }));
  }

  async function handleDisconnect(id: string) {
    await disconnectPlatform(id);
    setMap(m => {
      const updated = { ...m };
      for (const k of Object.keys(updated) as PlatformName[]) {
        if (updated[k]?.id === id) updated[k] = null;
      }
      return updated;
    });
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {platforms.map(p => (
        <PlatformCard
          key={p}
          platform={p}
          connection={map[p] ?? null}
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
        />
      ))}
    </div>
  );
}
