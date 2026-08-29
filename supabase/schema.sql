create table folios (id uuid primary key default gen_random_uuid(), folio text unique not null, hash text not null, status text default 'ORIGINAL', created_at timestamp default now());
create table audit_log (id uuid primary key default gen_random_uuid(), folio text, event text, created_at timestamp default now());
