-- Papéis de usuário (admin do painel)
create type public.app_role as enum ('admin');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  unique (user_id, role)
);

grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;

alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  )
$$;

-- Leads captados pela landing page
create table public.leads (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  whatsapp text not null,
  objetivo text not null,
  consentimento boolean not null default false,
  status text not null default 'novo',
  proxima_acao text,
  data_retorno date,
  notas text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant insert on public.leads to anon;
grant select, insert, update, delete on public.leads to authenticated;
grant all on public.leads to service_role;

alter table public.leads enable row level security;

-- Visitante só pode criar um lead (com consentimento), nunca ler
create policy "Visitantes podem criar leads"
on public.leads
for insert
to anon
with check (consentimento = true);

-- Apenas administradores autenticados leem e atualizam
create policy "Admins podem ler leads"
on public.leads
for select
to authenticated
using (public.has_role(auth.uid(), 'admin'));

create policy "Admins podem atualizar leads"
on public.leads
for update
to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins podem excluir leads"
on public.leads
for delete
to authenticated
using (public.has_role(auth.uid(), 'admin'));

-- Trigger para updated_at
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger leads_updated_at
before update on public.leads
for each row execute function public.set_updated_at();