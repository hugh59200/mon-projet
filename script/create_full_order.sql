create or replace function create_full_order(
  _user_id uuid,
  _email text,
  _full_name text,
  _address text,
  _zip text,
  _city text,
  _country text,
  _payment_method text,
  _total_amount numeric,
  _items jsonb   -- ✅ bien en jsonb
)
returns uuid
language plpgsql
as $$
declare
  new_order_id uuid;
begin
  insert into orders (
    user_id,
    email,
    full_name,
    address,
    zip,
    city,
    country,
    payment_method,
    total_amount,
    items,  -- ✅ type jsonb
    status,
    created_at
  )
  values (
    _user_id,
    _email,
    _full_name,
    _address,
    _zip,
    _city,
    _country,
    _payment_method,
    _total_amount,
    _items,
    'pending',
    now()
  )
  returning id into new_order_id;

  return new_order_id;
end;
$$;
