DO $$
DECLARE
  user_data JSONB;
  user_id UUID;
  existing_profile_count INT;
  fake_users JSONB := '[
    {"email":"emma.dupont@example.com","name":"Emma Dupont","role":"user"},
    {"email":"lucas.martin@example.com","name":"Lucas Martin","role":"user"},
    {"email":"lea.brunet@example.com","name":"Léa Brunet","role":"user"},
    {"email":"noah.roche@example.com","name":"Noah Roche","role":"user"},
    {"email":"chloe.leroy@example.com","name":"Chloé Leroy","role":"user"},
    {"email":"adam.moreau@example.com","name":"Adam Moreau","role":"user"},
    {"email":"manon.barbier@example.com","name":"Manon Barbier","role":"user"},
    {"email":"louis.fontaine@example.com","name":"Louis Fontaine","role":"user"},
    {"email":"camille.giraud@example.com","name":"Camille Giraud","role":"user"},
    {"email":"nathan.charles@example.com","name":"Nathan Charles","role":"user"},
    {"email":"julie.michel@example.com","name":"Julie Michel","role":"user"},
    {"email":"thomas.perez@example.com","name":"Thomas Perez","role":"user"},
    {"email":"pauline.renard@example.com","name":"Pauline Renard","role":"user"},
    {"email":"quentin.meyer@example.com","name":"Quentin Meyer","role":"user"},
    {"email":"clara.duval@example.com","name":"Clara Duval","role":"user"},
    {"email":"valentin.marchand@example.com","name":"Valentin Marchand","role":"user"},
    {"email":"juliette.gautier@example.com","name":"Juliette Gautier","role":"user"},
    {"email":"adrien.blanc@example.com","name":"Adrien Blanc","role":"user"},
    {"email":"anais.picard@example.com","name":"Anaïs Picard","role":"user"},
    {"email":"maxime.riviere@example.com","name":"Maxime Rivière","role":"admin"}
  ]';
BEGIN
  FOR user_data IN SELECT * FROM jsonb_array_elements(fake_users)
  LOOP
    -- Crée un utilisateur dans auth.users
    INSERT INTO auth.users (id, email, encrypted_password, created_at, updated_at)
    VALUES (
      gen_random_uuid(),
      user_data->>'email',
      crypt('password123', gen_salt('bf')),
      NOW(),
      NOW()
    )
    RETURNING id INTO user_id;

    -- Vérifie si un profil existe déjà
    SELECT COUNT(*) INTO existing_profile_count FROM public.profiles WHERE id = user_id;

    -- Crée le profil seulement si inexistant
    IF existing_profile_count = 0 THEN
      INSERT INTO public.profiles (id, email, role, created_at, full_name, avatar_url)
      VALUES (
        user_id,
        user_data->>'email',
        user_data->>'role',
        NOW(),
        user_data->>'name',
        NULL
      );
    END IF;
  END LOOP;
END $$;
