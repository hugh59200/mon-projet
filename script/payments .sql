create table payments (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references orders(id),
  amount numeric not null,
  currency text default 'EUR',
  status text check (status in ('pending', 'succeeded', 'failed')) default 'pending',
  created_at timestamptz default now()
);
