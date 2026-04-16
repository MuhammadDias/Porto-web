-- Table to store global settings like theme configuration
create table public.settings (
  id uuid default gen_random_uuid() primary key,
  active_theme text default 'default' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Note: You should restrict access to this table so only admins can modify it,
-- or make it world-readable if that's safe for your app.
alter table public.settings enable row level security;
create policy "Enable read access for all users" on public.settings for select using (true);

-- Insert default row if needed
insert into public.settings (active_theme) values ('spotify_ui');

-- Table to store user skills
create table public.skills (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  level integer check (level >= 0 and level <= 100),
  "order" integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.skills enable row level security;
create policy "Enable read access for all users" on public.skills for select using (true);

-- Table to store contact form messages
create table public.contact_messages (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  message text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.contact_messages enable row level security;
create policy "Enable insert for all users" on public.contact_messages for insert with check (true);
create policy "Enable read for authenticated users only" on public.contact_messages for select using (auth.role() = 'authenticated');
