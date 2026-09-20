-- Admin identity.
--
-- Email OTP means anyone can request a code for their own address and end up
-- with a valid `authenticated` session. So "is signed in" must never imply
-- "is admin": the existing policies check app_metadata.role = 'admin', and
-- this migration pins that role to one specific address.
--
-- The check lives in the database rather than in application code, so a bug
-- in an admin page still cannot expose the table.

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select email = 'suffynux@gmail.com' and email_confirmed_at is not null
       from auth.users
      where id = auth.uid()),
    false
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- Replace the app_metadata-based policies with ones that check the identity
-- directly. app_metadata is only settable via the Admin API, so it would work,
-- but this way admin access cannot be granted by accident - it is tied to a
-- confirmed email address and nothing else.
drop policy if exists "admin reads all quotes" on public.quotes;
drop policy if exists "admin inserts any quote" on public.quotes;
drop policy if exists "admin updates quotes" on public.quotes;
drop policy if exists "admin deletes quotes" on public.quotes;
drop policy if exists "admin updates wall settings" on public.wall_settings;

create policy "admin reads all quotes"
  on public.quotes for select to authenticated
  using ((select public.is_admin()));

create policy "admin inserts any quote"
  on public.quotes for insert to authenticated
  with check ((select public.is_admin()));

create policy "admin updates quotes"
  on public.quotes for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "admin deletes quotes"
  on public.quotes for delete to authenticated
  using ((select public.is_admin()));

create policy "admin updates wall settings"
  on public.wall_settings for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));
