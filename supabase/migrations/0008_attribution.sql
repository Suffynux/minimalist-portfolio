-- Proper attribution.
--
-- Until now, a null author_name meant "Sufiyan wrote this", which conflated
-- two different things: who wrote a line and who put it on the wall. A quote
-- Sufiyan collected from Rumi is not his writing, and a visitor posting
-- Nietzsche is not claiming to be Nietzsche.
--
-- Splitting the two makes every card honest:
--   author_name  - who said or wrote it (null = the poster's own words)
--   posted_by    - who put it on the wall (null = anonymous)

alter table public.quotes
  add column posted_by text,
  add constraint quotes_posted_by_len check (posted_by is null or char_length(posted_by) <= 60);

-- Everything seeded so far was put up by Sufiyan: his own lines and the ones
-- he collected. The existing author_name already says which is which.
update public.quotes set posted_by = 'Sufiyan' where source = 'owner';

-- Anon may now supply both fields, and still nothing else.
grant insert (body, author_name, posted_by) on public.quotes to anon;
grant select (id, body, author_name, posted_by, source, featured, seed, created_at)
  on public.quotes to anon;

-- Replace submit_quote to carry the new field.
drop function if exists public.submit_quote(text, text, boolean, text, boolean);

create or replace function public.submit_quote(
  p_body        text,
  p_author_name text,
  p_posted_by   text,
  p_flagged     boolean,
  p_flag_reason text,
  p_hold        boolean
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  if char_length(coalesce(p_body, '')) < 3 or char_length(p_body) > 280 then
    raise exception 'invalid body length' using errcode = 'check_violation';
  end if;

  if p_author_name is not null and char_length(p_author_name) > 60 then
    raise exception 'invalid author length' using errcode = 'check_violation';
  end if;

  if p_posted_by is not null and char_length(p_posted_by) > 60 then
    raise exception 'invalid poster length' using errcode = 'check_violation';
  end if;

  insert into quotes (body, author_name, posted_by, source, visible, flagged, flag_reason)
  values (
    p_body,
    nullif(btrim(coalesce(p_author_name, '')), ''),
    nullif(btrim(coalesce(p_posted_by, '')), ''),
    'visitor',
    not p_hold,
    coalesce(p_flagged, false),
    left(p_flag_reason, 200)
  )
  returning id into v_id;

  return v_id;
end;
$$;

revoke all on function public.submit_quote(text, text, text, boolean, text, boolean) from public;
grant execute on function public.submit_quote(text, text, text, boolean, text, boolean) to anon, authenticated;
