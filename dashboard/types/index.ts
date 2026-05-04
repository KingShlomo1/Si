export type PlatformName = 'twitter_x' | 'instagram' | 'linkedin' | 'tiktok' | 'facebook';

export type PostStatus = 'draft' | 'pending_approval' | 'approved' | 'published' | 'rejected';

export type AIDraftType = 'post_caption' | 'reply' | 'content_idea';

export interface BrandVoice {
  tone: string;
  audience: string;
  avoid: string;
  sample_posts: string[];
  keywords: string[];
}

export interface Profile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  website: string | null;
  brand_voice: BrandVoice;
  notify_on_approval: boolean;
  notify_on_reject: boolean;
  created_at: string;
  updated_at: string;
}

export interface ConnectedPlatform {
  id: string;
  user_id: string;
  platform: PlatformName;
  access_token: string;
  refresh_token: string | null;
  token_expires_at: string | null;
  platform_user_id: string | null;
  platform_username: string | null;
  is_active: boolean;
  connected_at: string;
  updated_at: string;
}

export interface Post {
  id: string;
  user_id: string;
  caption: string;
  media_urls: string[];
  platforms: PlatformName[];
  scheduled_at: string | null;
  status: PostStatus;
  rejection_note: string | null;
  approved_by: string | null;
  approved_at: string | null;
  published_at: string | null;
  tags: string[];
  notes: string | null;
  ai_assisted: boolean;
  created_at: string;
  updated_at: string;
}

export interface PostStatusHistory {
  id: string;
  post_id: string;
  from_status: PostStatus | null;
  to_status: PostStatus;
  changed_by: string | null;
  note: string | null;
  changed_at: string;
}

export interface AIDraft {
  id: string;
  user_id: string;
  post_id: string | null;
  draft_type: AIDraftType;
  prompt_inputs: Record<string, unknown>;
  content: string;
  used: boolean;
  model_used: string;
  created_at: string;
}

export interface StatusCounts {
  draft: number;
  pending_approval: number;
  approved: number;
  published: number;
  rejected: number;
}

export const PLATFORM_LABELS: Record<PlatformName, string> = {
  twitter_x: 'Twitter / X',
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
  tiktok: 'TikTok',
  facebook: 'Facebook',
};

export const STATUS_LABELS: Record<PostStatus, string> = {
  draft: 'Draft',
  pending_approval: 'Pending Approval',
  approved: 'Approved',
  published: 'Published',
  rejected: 'Rejected',
};

export const PLATFORM_CHAR_LIMITS: Record<PlatformName, number> = {
  twitter_x: 280,
  instagram: 2200,
  linkedin: 3000,
  tiktok: 2200,
  facebook: 63206,
};

export const STATUS_TRANSITIONS: Record<PostStatus, PostStatus[]> = {
  draft: ['pending_approval'],
  pending_approval: ['approved', 'rejected'],
  approved: ['published'],
  published: [],
  rejected: ['pending_approval'],
};
