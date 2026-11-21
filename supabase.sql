create table if not exists public.messages (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  nom text not null check (char_length(btrim(nom)) between 1 and 120),
  email text not null check (char_length(btrim(email)) between 3 and 254),
  message text not null check (char_length(btrim(message)) between 1 and 2000)
);

alter table public.messages enable row level security;
revoke all on table public.messages from anon, authenticated;
grant insert (nom, email, message) on table public.messages to anon, authenticated;
drop policy if exists "Envoyer un message" on public.messages;
create policy "Envoyer un message" on public.messages
  for insert to anon, authenticated with check (true);
