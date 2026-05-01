'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError('');
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); setLoading(false); return; }
    router.push('/dashboard');
    router.refresh();
  }

  async function handleGoogle() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/api/auth/callback` },
    });
  }

  return (
    <div className="w-full max-w-sm animate-fade-up">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--text)' }}>Welcome back</h2>
        <p className="text-sm" style={{ color: 'var(--text2)' }}>Sign in to your Creator Studio</p>
      </div>

      <button
        onClick={handleGoogle}
        className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl text-sm font-semibold transition-all hover:opacity-90 mb-6"
        style={{ background: 'var(--surface2)', border: '1px solid var(--border2)', color: 'var(--text)' }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"/><path fill="#FBBC05" d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z"/></svg>
        Continue with Google
      </button>

      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-px" style={{ background: 'var(--border2)' }} />
        <span className="text-xs" style={{ color: 'var(--text3)' }}>or</span>
        <div className="flex-1 h-px" style={{ background: 'var(--border2)' }} />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <div className="p-3 rounded-lg text-sm" style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}>
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: 'var(--text2)' }}>Email</label>
          <input
            type="email" value={email} onChange={e => setEmail(e.target.value)} required
            className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
            style={{ background: 'var(--surface)', border: '1px solid var(--border2)', color: 'var(--text)' }}
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: 'var(--text2)' }}>Password</label>
          <input
            type="password" value={password} onChange={e => setPassword(e.target.value)} required
            className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
            style={{ background: 'var(--surface)', border: '1px solid var(--border2)', color: 'var(--text)' }}
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit" disabled={loading}
          className="w-full py-3 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90 disabled:opacity-50 mt-2"
          style={{ background: 'var(--grad)' }}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <p className="text-center text-sm mt-6" style={{ color: 'var(--text2)' }}>
        No account?{' '}
        <Link href="/signup" className="font-semibold" style={{ color: 'var(--purple-light)' }}>Sign up free</Link>
      </p>
    </div>
  );
}
