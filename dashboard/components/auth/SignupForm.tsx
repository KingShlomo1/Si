'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function SignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError('');
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: name }, emailRedirectTo: `${location.origin}/api/auth/callback` },
    });
    if (error) { setError(error.message); setLoading(false); return; }
    setDone(true);
  }

  if (done) return (
    <div className="w-full max-w-sm text-center animate-fade-up">
      <div className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center text-3xl" style={{ background: 'rgba(124,58,237,0.15)' }}>✉️</div>
      <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text)' }}>Check your email</h2>
      <p className="text-sm" style={{ color: 'var(--text2)' }}>We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account.</p>
      <Link href="/login" className="inline-block mt-6 text-sm font-semibold" style={{ color: 'var(--purple-light)' }}>Back to login</Link>
    </div>
  );

  return (
    <div className="w-full max-w-sm animate-fade-up">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--text)' }}>Create your account</h2>
        <p className="text-sm" style={{ color: 'var(--text2)' }}>Start managing your social media smarter</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && <div className="p-3 rounded-lg text-sm" style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}>{error}</div>}

        {[
          { label: 'Full Name', type: 'text', value: name, set: setName, placeholder: 'Your name' },
          { label: 'Email', type: 'email', value: email, set: setEmail, placeholder: 'you@example.com' },
          { label: 'Password', type: 'password', value: password, set: setPassword, placeholder: '8+ characters' },
        ].map(f => (
          <div key={f.label}>
            <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: 'var(--text2)' }}>{f.label}</label>
            <input
              type={f.type} value={f.value} onChange={e => f.set(e.target.value)} required
              placeholder={f.placeholder}
              className="w-full rounded-xl px-4 py-3 text-sm outline-none"
              style={{ background: 'var(--surface)', border: '1px solid var(--border2)', color: 'var(--text)' }}
            />
          </div>
        ))}

        <button type="submit" disabled={loading}
          className="w-full py-3 rounded-xl font-bold text-sm text-white mt-2 hover:opacity-90 disabled:opacity-50"
          style={{ background: 'var(--grad)' }}>
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <p className="text-center text-sm mt-6" style={{ color: 'var(--text2)' }}>
        Already have an account?{' '}
        <Link href="/login" className="font-semibold" style={{ color: 'var(--purple-light)' }}>Sign in</Link>
      </p>
    </div>
  );
}
