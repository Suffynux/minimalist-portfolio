-- The quote wall.
--
-- Publishing model: visitor submissions go live immediately (visible = true),
-- and the owner hides them after the fact. The profanity screen does NOT
-- auto-reject: a flagged quote lands hidden and waits for a human, so a false
-- positive delays a genuine submission rather than silently destroying it.
--
-- Because everything is public by default, the protection lives at the front
-- door (column grants, CHECK constraints, rate limiting) rather than in a
-- moderation queue.

create type public.quote_source as enum ('owner', 'visitor');

create table public.quotes (
  id            uuid primary key default gen_random_uuid(),
  body          text not null,
  author_name   text,
  source        public.quote_source not null default 'visitor',

  -- Soft delete. Hiding is instant and reversible, so a misclick costs nothing.
  visible       boolean not null default true,
  -- Owner-picked quotes that get prominence in the scene.
  featured      boolean not null default false,

  -- Set by the profanity screen at submission time. A non-null score with
  -- flagged = true means "hidden, needs a look", never "deleted".
  flagged       boolean not null default false,
  flag_reason   text,

  -- Stable pseudo-random seed so a quote always occupies the same position
  -- and tint in the scene across reloads.
  seed          double precision not null default random(),

  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),

  constraint quotes_body_len check (char_length(body) between 1 and 280),
  constraint quotes_author_len check (author_name is null or char_length(author_name) <= 60),
  constraint quotes_flag_reason_len check (flag_reason is null or char_length(flag_reason) <= 200)
);

-- The public page's only query: visible, unflagged, newest first.
create index quotes_public_idx on public.quotes (created_at desc)
  where visible = true and flagged = false;

-- The admin's review query: flagged or hidden rows.
create index quotes_review_idx on public.quotes (created_at desc)
  where flagged = true or visible = false;

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger quotes_set_updated_at
  before update on public.quotes
  for each row execute function public.set_updated_at();

alter table public.quotes enable row level security;
alter table public.quotes force row level security;

-- Grants are a separate layer from policies: Supabase grants anon broad access
-- by default, and adding policies does not revoke it.
revoke all on public.quotes from anon, authenticated;

-- Anon reads only the display columns. Never `flagged`, `flag_reason` or
-- `visible` - the existence of hidden rows is not public information.
grant select (id, body, author_name, source, featured, seed, created_at)
  on public.quotes to anon;

-- Anon writes only the two fields a submission form collects. `visible`,
-- `flagged`, `source` and `featured` are deliberately absent, so a crafted
-- request cannot self-promote a quote or bypass the screen.
grant insert (body, author_name) on public.quotes to anon;

grant select, insert, update, delete on public.quotes to authenticated;

create policy "public reads visible quotes"
  on public.quotes for select to anon, authenticated
  using (visible = true and flagged = false);

create policy "anon submits quotes"
  on public.quotes for insert to anon
  with check (
    source = 'visitor'
    and featured = false
    and flagged = false
    and visible = true
  );

create policy "admin reads all quotes"
  on public.quotes for select to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "admin inserts any quote"
  on public.quotes for insert to authenticated
  with check ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "admin updates quotes"
  on public.quotes for update to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "admin deletes quotes"
  on public.quotes for delete to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Single-row settings table. `instant_publish = false` flips the whole wall to
-- moderated mode without a deploy - the escape hatch if submissions ever get
-- abused.
create table public.wall_settings (
  id              boolean primary key default true,
  instant_publish boolean not null default true,
  accepting       boolean not null default true,
  updated_at      timestamptz not null default now(),
  constraint wall_settings_singleton check (id = true)
);

insert into public.wall_settings (id) values (true);

alter table public.wall_settings enable row level security;
alter table public.wall_settings force row level security;

revoke all on public.wall_settings from anon, authenticated;
grant select (id, instant_publish, accepting) on public.wall_settings to anon;
grant select, update on public.wall_settings to authenticated;

create policy "anyone reads wall settings"
  on public.wall_settings for select to anon, authenticated
  using (true);

create policy "admin updates wall settings"
  on public.wall_settings for update to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
