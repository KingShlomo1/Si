import { createClient } from '@/lib/supabase/server';
import SettingsClient from './SettingsClient';
import type { Profile } from '@/types';

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from('profiles').select('*').eq('id', user!.id).single();

  return (
    <div className="max-w-2xl mx-auto animate-fade-up">
      <div className="mb-6">
        <h2 className="text-xl font-black" style={{ color: 'var(--text)' }}>Settings</h2>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text2)' }}>Configure your profile and brand voice</p>
      </div>
      <SettingsClient profile={profile as Profile} userEmail={user!.email ?? ''} />
    </div>
  );
}
