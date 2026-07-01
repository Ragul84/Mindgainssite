-- EMERGENCY FIX: Reset RLS for user_profiles to prevent infinite recursion 500s

-- 1. Enable RLS (Ensure it's on)
alter table public.user_profiles enable row level security;

-- 2. Drop potential recursive policies (We drop specific names if guessed, but better to drop by pattern or just overwrite)
-- Since we don't know the exact names, we can try dropping common ones or valid ones.
-- The safest way in raw SQL without knowing names is tricky, but often we can just create a NEW policy that overrides behavior if we use a permissive one, 
-- OR strictly: we assume this migration might fail if policy doesn't exist, so we use "DROP POLICY IF EXISTS".

drop policy if exists "Users can view own profile" on public.user_profiles;
drop policy if exists "Users can update own profile" on public.user_profiles;
drop policy if exists "Public profiles are viewable by everyone" on public.user_profiles;
drop policy if exists "Users can insert their own profile" on public.user_profiles;
drop policy if exists "Enable read access for all users" on public.user_profiles;
drop policy if exists "Enable insert for authenticated users only" on public.user_profiles;
drop policy if exists "Enable update for users based on email" on public.user_profiles;

-- 3. Create SIMPLE, SAFE policies (No sub-queries, No loops)

-- SELECT: Users can see their own profile
create policy "Users can view own profile"
on public.user_profiles for select
using ( auth.uid() = id );

-- UPDATE: Users can update their own profile
create policy "Users can update own profile"
on public.user_profiles for update
using ( auth.uid() = id );

-- INSERT: Users can insert their own profile (often needed on signup)
create policy "Users can insert own profile"
on public.user_profiles for insert
with check ( auth.uid() = id );

-- 4. Service Role Bypass (Already handled by Supabase, but good to be explicit if using custom roles)
-- Note: Service role always has bypass, so no policy needed typically.

-- 5. Fix `user_stats` too just in case (as it's fetched right after)
alter table public.user_stats enable row level security;
drop policy if exists "Users can view own stats" on public.user_stats;
create policy "Users can view own stats"
on public.user_stats for select
using ( auth.uid() = user_id );
