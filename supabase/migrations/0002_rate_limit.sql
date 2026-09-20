-- Rate limiting for anonymous submissions.
--
-- Uses Postgres rather than adding Upstash/Redis: this site already has a
-- database, the volume is a handful of submissions a day, and one fewer
-- third-party service is one fewer thing to expire or leak.
--
-- The counter table is never readable by anon - only the SECURITY DEFINER
-- function below touches it, so a visitor cannot enumerate other submitters'
-- IP hashes.

create table public.submission_log (
  id         bigserial primary key,
  -- SHA-256 of (IP + a server-side salt). Never the raw address: this is
  -- personal data and we only need equality, not the value itself.
  ip_hash    text not null,
  created_at timestamptz not null default now()
);

create index submission_log_ip_time_idx on public.submission_log (ip_hash, created_at desc);

revoke all on public.submission_log from anon, authenticated;
alter table public.submission_log enable row level security;
alter table public.submission_log force row level security;
-- No policies at all: nothing but the definer function below can reach it.

/**
 * Records a submission attempt and reports whether it is within the limit.
 *
 * SECURITY DEFINER so it can write to a table anon cannot touch. Returns the
 * remaining allowance so the UI can tell someone how many they have left
 * rather than failing opaquely.
 */
create or replace function public.check_submission_rate(
  p_ip_hash text,
  p_limit   integer default 5,
  p_window  interval default '1 hour'
)
returns table (allowed boolean, used integer, retry_after timestamptz)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_used integer;
  v_oldest timestamptz;
begin
  delete from submission_log where created_at < now() - '24 hours'::interval;

  select count(*), min(created_at)
    into v_used, v_oldest
    from submission_log
   where ip_hash = p_ip_hash
     and created_at > now() - p_window;

  if v_used >= p_limit then
    return query select false, v_used, v_oldest + p_window;
    return;
  end if;

  insert into submission_log (ip_hash) values (p_ip_hash);
  return query select true, v_used + 1, null::timestamptz;
end;
$$;

revoke all on function public.check_submission_rate(text, integer, interval) from public;
grant execute on function public.check_submission_rate(text, integer, interval) to anon, authenticated;
