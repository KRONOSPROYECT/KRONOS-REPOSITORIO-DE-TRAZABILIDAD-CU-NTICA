create table if not exists folios (id uuid primary key default gen_random_uuid(), folio text unique not null, hash text not null, status text default 'ORIGINAL', created_at timestamp default now());
create table if not exists audit_log (id uuid primary key default gen_random_uuid(), folio text, event text, ip text, created_at timestamp default now());
-- RLS
alter table folios enable row level security;
create policy "public can read folios" on folios for select using (true);
