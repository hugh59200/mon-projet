# 📰 Configuration complète des Actualités (Supabase + Vue)

## 1️⃣ Table `news`

### 🧱 SQL à créer
```sql
create table if not exists public.news (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  excerpt text,
  content text,
  image text,
  published_at timestamptz default now(),
  author_id uuid references public.profiles(id) on delete set null
);

alter table public.news enable row level security;

-- Lecture publique (tout le monde peut lire les actus)
create policy "Public can read news"
  on public.news
  for select
  using (true);

-- Création / édition / suppression réservées aux admins
create policy "Admins full access to news"
  on public.news
  for all
  to authenticated
  using (public.is_admin(auth.uid()));


2️⃣ Bucket news-images
🪣 Création

Dans Storage → Buckets, crée un bucket nommé :

news-images


et coche Public ✅

🛡️ Policies dans Supabase (Storage)

Crée manuellement (dans le Dashboard → Storage → Buckets → news-images → Policies) :

Name	Action	Roles	Condition
Public can read news images	SELECT	anon, authenticated	bucket_id = 'news-images'
Admins full access to news images	ALL	authenticated	bucket_id = 'news-images' and public.is_admin(auth.uid())

➡️ Cela donne :

🌍 Public : peut voir les images (affichage front)

🔐 Admin : peut uploader, modifier, supprimer