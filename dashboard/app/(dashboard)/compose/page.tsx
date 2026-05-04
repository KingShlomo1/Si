'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PlatformSelector from '@/components/compose/PlatformSelector';
import AISidePanel from '@/components/compose/AISidePanel';
import { createClient } from '@/lib/supabase/client';
import type { PlatformName } from '@/types';

const TONES = ['Casual', 'Professional', 'Inspirational', 'Funny', 'Educational'];

export default function ComposePage() {
  const router = useRouter();
  const [caption, setCaption] = useState('');
  const [platforms, setPlatforms] = useState<PlatformName[]>([]);
  const [scheduledAt, setScheduledAt] = useState('');
  const [notes, setNotes] = useState('');
  const [aiAssisted, setAiAssisted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [submitReview, setSubmitReview] = useState(false);

  async function handleSave() {
    setSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/login'); return; }

    const { error } = await supabase.from('posts').insert({
      user_id: user.id,
      caption,
      platforms,
      scheduled_at: scheduledAt || null,
      notes: notes || null,
      status: submitReview ? 'pending_approval' : 'draft',
      ai_assisted: aiAssisted,
    });

    setSaving(false);
    if (!error) router.push('/queue');
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-up">
      <div className="mb-6">
        <h2 className="text-xl font-black" style={{ color: 'var(--text)' }}>Compose Post</h2>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text2)' }}>Write or use AI to draft your content</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Main composer */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="rounded-2xl p-5" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            {/* Caption */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text2)' }}>Caption</label>
                <span className="text-xs" style={{ color: caption.length > 2000 ? '#ef4444' : 'var(--text3)' }}>
                  {caption.length} / 2200
                </span>
              </div>
              <textarea
                value={caption}
                onChange={e => { setCaption(e.target.value); setAiAssisted(false); }}
                placeholder="Write your caption here, or use the AI assistant →"
                rows={8}
                className="w-full rounded-xl px-4 py-3 text-sm resize-none outline-none leading-relaxed"
                style={{ background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--text)' }}
              />
            </div>

            {/* Platforms */}
            <div className="mb-4">
              <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text2)' }}>Platforms</label>
              <PlatformSelector selected={platforms} onChange={setPlatforms} />
            </div>

            {/* Schedule */}
            <div className="mb-4">
              <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text2)' }}>Schedule (optional)</label>
              <input
                type="datetime-local" value={scheduledAt} onChange={e => setScheduledAt(e.target.value)}
                className="rounded-xl px-4 py-2.5 text-sm outline-none"
                style={{ background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--text)' }}
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text2)' }}>Internal Notes</label>
              <input
                value={notes} onChange={e => setNotes(e.target.value)}
                placeholder="e.g. needs image, reference campaign X..."
                className="w-full rounded-xl px-4 py-2.5 text-sm outline-none"
                style={{ background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--text)' }}
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => { setSubmitReview(false); handleSave(); }}
              disabled={saving || !caption.trim()}
              className="flex-1 py-3 rounded-xl text-sm font-bold disabled:opacity-50 transition-all hover:opacity-80"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}>
              {saving ? 'Saving...' : 'Save as Draft'}
            </button>
            <button
              onClick={() => { setSubmitReview(true); handleSave(); }}
              disabled={saving || !caption.trim()}
              className="flex-1 py-3 rounded-xl text-sm font-bold text-white disabled:opacity-50 transition-all hover:opacity-90"
              style={{ background: 'var(--grad)' }}>
              {saving ? 'Saving...' : 'Submit for Review →'}
            </button>
          </div>
        </div>

        {/* AI panel */}
        <div>
          <AISidePanel
            platforms={platforms}
            onUseText={text => { setCaption(text); setAiAssisted(true); }}
          />
        </div>
      </div>
    </div>
  );
}
