-- Creates the single admin user.
--
-- Sign-ups are meant to stay disabled and the login form passes
-- shouldCreateUser:false, so the account has to exist before the first login.
-- The email is pre-confirmed because there is no password to set and no
-- confirmation link to click - the OTP itself proves ownership on each login.
--
-- Safe to re-run: does nothing if the user already exists.

insert into auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
)
select
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'suffynux@gmail.com',
  now(),
  jsonb_build_object('provider', 'email', 'providers', jsonb_build_array('email'), 'role', 'admin'),
  '{}'::jsonb,
  now(),
  now()
where not exists (
  select 1 from auth.users where email = 'suffynux@gmail.com'
);
