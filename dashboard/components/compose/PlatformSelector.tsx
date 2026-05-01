'use client';

import type { PlatformName } from '@/types';
import { PLATFORM_LABELS } from '@/types';

const ALL: PlatformName[] = ['twitter_x', 'instagram', 'linkedin', 'tiktok', 'facebook'];

interface Props {
  selected: PlatformName[];
  onChange: (val: PlatformName[]) => void;
}

export default function PlatformSelector({ selected, onChange }: Props) {
  function toggle(p: PlatformName) {
    onChange(selected.includes(p) ? selected.filter(x => x !== p) : [...selected, p]);
  }

  return (
    <div className="flex flex-wrap gap-2">
      {ALL.map(p => {
        const active = selected.includes(p);
        return (
          <button key={p} type="button" onClick={() => toggle(p)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
            style={{
              background: active ? 'var(--grad)' : 'var(--surface2)',
              color: active ? '#fff' : 'var(--text2)',
              border: active ? 'none' : '1px solid var(--border)',
            }}>
            {PLATFORM_LABELS[p]}
          </button>
        );
      })}
    </div>
  );
}
