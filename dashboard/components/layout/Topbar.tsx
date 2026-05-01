'use client';

import { useRouter, usePathname } from 'next/navigation';
import { LogOut, User } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const TITLES: Record<string, string> = {
  '/dashboard':  'Overview',
  '/queue':      'Post Queue',
  '/compose':    'Compose',
  '/platforms':  'Platforms',
  '/ai':         'AI Assistant',
  '/settings':   'Settings',
};

export default function Topbar({ userEmail }: { userEmail: string }) {
  const router = useRouter();
  const path = usePathname();
  const title = TITLES[path] ?? 'Dashboard';

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  return (
    <header className="h-14 flex items-center justify-between px-6 sticky top-0 z-40"
      style={{ background: 'rgba(10,10,20,0.8)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)' }}>

      <h1 className="text-base font-bold" style={{ color: 'var(--text)' }}>{title}</h1>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <User size={13} style={{ color: 'var(--text2)' }} />
          <span className="text-xs font-medium" style={{ color: 'var(--text2)' }}>
            {userEmail.split('@')[0]}
          </span>
        </div>

        <button onClick={logout}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all hover:opacity-80"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text2)' }}>
          <LogOut size={13} />
          Sign out
        </button>
      </div>
    </header>
  );
}
