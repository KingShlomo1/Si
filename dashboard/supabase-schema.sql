-- ============================================================
-- Run this entire file in your Supabase project's SQL Editor
-- ============================================================

create extension if not exists "uuid-ossp";

-- ── Enums ─────────────────────────────────────────────────────────────────────
create type platform_name as enum ('twitter_x','instagram','linkedin','tiktok','facebook');
create type post_status    as enum ('draft','pending_approval','approved','published','rejected');
create type ai_draft_type  as enum ('post_caption','reply','content_idea');

-- ── profiles ──────────────────────────────────────────────────────────────────
create table public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  display_name  text,
  avatar_url    text,
  website       text,
  brand_voice   jsonb not null default '{
    "tone":"casual and authentic",
    "audience":"",
    "avoid":"",
    "sample_posts":[],
    "keywords":[]
  }'::jsonb,
  notify_on_approval boolean not null default true,
  notify_on_reject   boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Auto-create profile on new user signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email,'@',1)),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── connected_platforms ───────────────────────────────────────────────────────
create table public.connected_platforms (
  id                   uuid primary key default uuid_generate_v4(),
  user_id              uuid not null references public.profiles(id) on delete cascade,
  platform             platform_name not null,
  access_token         text not null,
  refresh_token        text,
  token_expires_at     timestamptz,
  platform_user_id     text,
  platform_username    text,
  is_active            boolean not null default true,
  connected_at         timestamptz not null default now(),
  updated_at           timestamptz not null default now(),
  unique(user_id, platform)
);

-- ── posts ─────────────────────────────────────────────────────────────────────
create table public.posts (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid not null references public.profiles(id) on delete cascade,
  caption         text not null default '',
  media_urls      text[] not null default '{}',
  platforms       platform_name[] not null default '{}',
  scheduled_at    timestamptz,
  status          post_status not null default 'draft',
  rejection_note  text,
  approved_by     uuid references public.profiles(id),
  approved_at     timestamptz,
  published_at    timestamptz,
  tags            text[] not null default '{}',
  notes           text,
  ai_assisted     boolean not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ── post_status_history ───────────────────────────────────────────────────────
create table public.post_status_history (
  id          uuid primary key default uuid_generate_v4(),
  post_id     uuid not null references public.posts(id) on delete cascade,
  from_status post_status,
  to_status   post_status not null,
  changed_by  uuid references public.profiles(id),
  note        text,
  changed_at  timestamptz not null default now()
);

-- ── ai_drafts ─────────────────────────────────────────────────────────────────
create table public.ai_drafts (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references public.profiles(id) on delete cascade,
  post_id       uuid references public.posts(id) on delete set null,
  draft_type    ai_draft_type not null,
  prompt_inputs jsonb not null default '{}',
  content       text not null,
  used          boolean not null default false,
  model_used    text not null default 'claude-haiku-4-5-20251001',
  created_at    timestamptz not null default now()
);

-- ── Row Level Security ────────────────────────────────────────────────────────
alter table public.profiles            enable row level security;
alter table public.connected_platforms enable row level security;
alter table public.posts               enable row level security;
alter table public.post_status_history enable row level security;
alter table public.ai_drafts           enable row level security;

create policy "profiles: own row"     on public.profiles            for all using (auth.uid() = id);
create policy "platforms: own rows"   on public.connected_platforms for all using (auth.uid() = user_id);
create policy "posts: own rows"       on public.posts               for all using (auth.uid() = user_id);
create policy "history: read"         on public.post_status_history for select using (exists (select 1 from public.posts p where p.id = post_id and p.user_id = auth.uid()));
create policy "history: insert"       on public.post_status_history for insert with check (auth.uid() = changed_by);
create policy "ai_drafts: own rows"   on public.ai_drafts           for all using (auth.uid() = user_id);

-- ── Indexes ───────────────────────────────────────────────────────────────────
create index idx_posts_user_status   on public.posts(user_id, status);
create index idx_posts_scheduled     on public.posts(scheduled_at) where scheduled_at is not null;
create index idx_ai_drafts_user_type on public.ai_drafts(user_id, draft_type);
create index idx_platforms_user      on public.connected_platforms(user_id, platform);
