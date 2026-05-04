import { createClient } from '@/lib/supabase/server';
import PlatformsClient from './PlatformsClient';
import type { ConnectedPlatform, PlatformName } from '@/types';

const ALL_PLATFORMS: PlatformName[] = ['twitter_x', 'instagram', 'linkedin', 'tiktok', 'facebook'];

export default async function PlatformsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: connections } = await supabase
    .from('connected_platforms').select('*').eq('user_id', user!.id);

  const connectionMap = Object.fromEntries(
    (connections as ConnectedPlatform[] ?? []).map(c => [c.platform, c])
  ) as Record<PlatformName, ConnectedPlatform | null>;

  return (
    <div className="max-w-3xl mx-auto animate-fade-up">
      <div className="mb-6">
        <h2 className="text-xl font-black" style={{ color: 'var(--text)' }}>Connected Platforms</h2>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text2)' }}>
          Manage your social media accounts
        </p>
      </div>
      <PlatformsClient platforms={ALL_PLATFORMS} connectionMap={connectionMap} />
    </div>
  );
}
