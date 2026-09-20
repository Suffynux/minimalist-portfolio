-- Adds password sign-in for the admin.
--
-- Supabase's default email service is heavily rate limited and, on this
-- project, is not delivering. OTP stays available, but a password means admin
-- access never depends on an email arriving.
--
-- The password is set by a separate local script rather than written here, so
-- no credential is ever committed to the repository. This migration only
-- ensures the account is shaped correctly for password auth.

update auth.users
set
  -- Password auth requires an identity row and these fields populated.
  aud = 'authenticated',
  role = 'authenticated',
  email_confirmed_at = coalesce(email_confirmed_at, now()),
  raw_app_meta_data =
    coalesce(raw_app_meta_data, '{}'::jsonb)
    || jsonb_build_object('provider', 'email', 'providers', jsonb_build_array('email')),
  updated_at = now()
where email = 'suffynux@gmail.com';

-- Supabase looks up password logins through auth.identities, not auth.users
-- alone. Without this row, signInWithPassword fails even with a valid hash.
insert into auth.identities (
  provider_id,
  user_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
)
select
  u.id::text,
  u.id,
  jsonb_build_object('sub', u.id::text, 'email', u.email, 'email_verified', true, 'phone_verified', false),
  'email',
  now(),
  now(),
  now()
from auth.users u
where u.email = 'suffynux@gmail.com'
  and not exists (
    select 1 from auth.identities i
    where i.user_id = u.id and i.provider = 'email'
  );
