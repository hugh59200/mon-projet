-- ==========================================
-- FUNCTION : create_full_order()
-- ==========================================
create or replace function public.create_full_order(
  _user_id uuid,
  _email text,
  _full_name text,
  _address text,
  _zip text,
  _city text,
  _country text,
  _payment_method text,
  _total_amount numeric,
  _items jsonb
)
returns uuid
language plpgsql
security definer
as $$
declare
  new_order_id uuid;
begin
  -- Démarre une transaction implicite
  insert into public.orders (
    user_id, email, full_name, address, zip, city, country,
    payment_method, total_amount, status
  )
  values (
    _user_id, _email, _full_name, _address, _zip, _city, _country,
    _payment_method, _total_amount, 'En attente'
  )
  returning id into new_order_id;

  -- Boucle sur les items JSONB et insère dans order_items
  insert into public.order_items (order_id, product_id, product_name, price, quantity)
  select
    new_order_id,
    (item->>'id')::text,
    (item->>'name')::text,
    (item->>'price')::numeric,
    (item->>'quantity')::int
  from jsonb_array_elements(_items) as item;

  -- Retourne l'ID de la commande créée
  return new_order_id;
end;
$$;

-- ==========================================
-- SECURITE
-- ==========================================
revoke all on function public.create_full_order from public;

grant execute on function public.create_full_order(uuid, text, text, text, text, text, text, text, numeric, jsonb)
  to authenticated;

comment on function public.create_full_order(uuid, text, text, text, text, text, text, text, numeric, jsonb)
  is 'Crée une commande + ses produits associés dans une transaction unique';
