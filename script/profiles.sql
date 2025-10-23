-- =============================================================
-- 🧱 TABLE PROFILES + TRIGGER handle_new_user()
-- =============================================================

create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  email text unique,
  full_name text,
  role text default 'user',
  avatar_url text,
  created_at timestamp with time zone default now()
);

-- Fonction déclenchée à chaque nouvel utilisateur
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role, created_at)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    'user',
    now()
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

-- Trigger lié à auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- =============================================================
-- 🔐 RLS (Row Level Security)
-- =============================================================
alter table public.profiles enable row level security;

-- Supprime toutes les anciennes policies
drop policy if exists "Users can view their own profile" on public.profiles;
drop policy if exists "Users can update their own profile" on public.profiles;
drop policy if exists "Admins can manage all profiles" on public.profiles;

-- 👁️ Lecture de son propre profil
create policy "Users can view their own profile"
on public.profiles
for select
using (auth.uid() = id);

-- ✏️ Mise à jour de son propre profil
create policy "Users can update their own profile"
on public.profiles
for update
using (auth.uid() = id);

-- 🛠️ Gestion complète pour les admins
create policy "Admins can manage all profiles"
on public.profiles
for all
to authenticated
using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
);

-- =============================================================
-- 🪄 JWT CUSTOM CLAIMS (fonction mise à jour)
-- =============================================================

-- ⚠️ jwt_claims_builder est déprécié → on utilise une fonction custom
create or replace function public.jwt_custom_claims() 
returns jsonb 
language sql stable as $$
  select jsonb_build_object('role', role)
  from public.profiles
  where id = auth.uid();
$$;

-- Supabase appelle automatiquement jwt_custom_claims() si elle existe
-- donc pas besoin d’utiliser alter role authenticator ...

-- =============================================================
-- 🧪 SEED D'UTILISATEURS FACTICES (optionnel)
-- =============================================================
do $$
declare
  user_data jsonb;
  user_id uuid;
  fake_users jsonb := '[ 
    {"email":"emma.dupont@example.com","name":"Emma Dupont","role":"user"},
    {"email":"lucas.martin@example.com","name":"Lucas Martin","role":"user"},
    {"email":"maxime.riviere@example.com","name":"Maxime Rivière","role":"admin"},
    {"email":"h.bogrand@gmail.com","name":"Hugo Bogrand","role":"admin"}
  ]';
begin
  delete from public.profiles where email like '%@example.com%';
  delete from auth.users where email like '%@example.com%';

  for user_data in select * from jsonb_array_elements(fake_users)
  loop
    select id into user_id from auth.users where email = user_data->>'email';
    if user_id is null then
      insert into auth.users (id, email, encrypted_password, created_at, updated_at)
      values (gen_random_uuid(), user_data->>'email', crypt('password123', gen_salt('bf')), now(), now())
      returning id into user_id;
    end if;

    update public.profiles
      set full_name = user_data->>'name',
          role = user_data->>'role',
          email = user_data->>'email'
      where id = user_id;

    insert into public.profiles (id, email, full_name, role, created_at)
    select user_id, user_data->>'email', user_data->>'name', user_data->>'role', now()
    where not exists (select 1 from public.profiles where id = user_id);
  end loop;
end $$;
