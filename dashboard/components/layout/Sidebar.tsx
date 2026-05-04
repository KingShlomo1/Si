'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ListChecks, PenSquare, Share2, Sparkles, Settings } from 'lucide-react';
import { cn } from '@/lib/cn';

const NAV = [
  { href: '/dashboard',  icon: LayoutDashboard, label: 'Overview' },
  { href: '/queue',      icon: ListChecks,      label: 'Post Queue' },
  { href: '/compose',    icon: PenSquare,       label: 'Compose' },
  { href: '/platforms',  icon: Share2,          label: 'Platforms' },
  { href: '/ai',         icon: Sparkles,        label: 'AI Assistant' },
  { href: '/settings',   icon: Settings,        label: 'Settings' },
];

export default function Sidebar() {
  const path = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-[220px] flex flex-col z-50"
      style={{ background: 'var(--surface)', borderRight: '1px solid var(--border)' }}>

      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="w-7 h-7 rounded-lg flex-shrink-0" style={{ background: 'var(--grad)' }} />
        <span className="font-bold text-sm" style={{ color: 'var(--text)' }}>Creator Studio</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 flex flex-col gap-1">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = path === href || path.startsWith(href + '/');
          return (
            <Link key={href} href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                active
                  ? 'text-white'
                  : 'hover:bg-white/5'
              )}
              style={active
                ? { background: 'linear-gradient(135deg,rgba(124,58,237,0.4),rgba(236,72,153,0.2))', color: 'var(--text)', border: '1px solid rgba(124,58,237,0.3)' }
                : { color: 'var(--text2)' }
              }
            >
              <Icon size={17} className="flex-shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t text-xs" style={{ borderColor: 'var(--border)', color: 'var(--text3)' }}>
        Social Dashboard v1.0
      </div>
    </aside>
  );
}
