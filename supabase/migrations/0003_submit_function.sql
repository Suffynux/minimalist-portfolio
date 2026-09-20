-- Atomic submission.
--
-- The obvious two-step - INSERT, then UPDATE to hide a flagged quote - has a
-- race: the row is publicly visible between the two statements, which is
-- exactly the window that matters for the content we want to hold back.
--
-- This does it in one statement. anon still cannot set `visible` or `flagged`
-- directly; only this definer-owned function can, and it decides from the
-- screening verdict the server action passes in.

create or replace function public.submit_quote(
  p_body        text,
  p_author_name text,
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

  insert into quotes (body, author_name, source, visible, flagged, flag_reason)
  values (
    p_body,
    nullif(btrim(coalesce(p_author_name, '')), ''),
    'visitor',
    not p_hold,
    coalesce(p_flagged, false),
    left(p_flag_reason, 200)
  )
  returning id into v_id;

  return v_id;
end;
$$;

revoke all on function public.submit_quote(text, text, boolean, text, boolean) from public;
grant execute on function public.submit_quote(text, text, boolean, text, boolean) to anon, authenticated;
