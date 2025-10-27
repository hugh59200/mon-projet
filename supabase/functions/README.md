# Déploiement des Fonctions Supabase

## 1️⃣ S’assurer d’être connecté à ton projet Supabase

./supabase.exe login

## 3️⃣ Déployer la fonction

./supabase.exe functions deploy create-stripe-session

## 3️⃣ Déployer la fonction

./supabase.exe functions deploy stripe-webhook --no-verify-jwt

## ou tout déployer

./supabase.exe functions deploy --all
