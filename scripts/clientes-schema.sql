-- Módulo CLIENTES del panel /admin (sección ADM): clientes, sus proyectos, sus
-- mensualidades y lo que han pagado. Pegar completo en Supabase → SQL Editor y
-- ejecutar una vez. Se puede volver a correr sin romper nada.
--
-- Solo se guarda lo que se captura a mano. Lo que falta de cada proyecto, lo que
-- se debe de mensualidades y las gráficas se calculan en lib/clientes.ts.

create table if not exists cli_clients (
    id uuid primary key default gen_random_uuid(),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    name text not null,
    company text,
    email text,
    phone text,
    notes text,
    -- Un cliente con pagos no se borra: se archiva para no perder el historial.
    archived boolean not null default false
);

create table if not exists cli_projects (
    id uuid primary key default gen_random_uuid(),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    client_id uuid not null references cli_clients (id) on delete restrict,
    name text not null,
    status text not null default 'esperando'
        check (status in ('esperando', 'aprobado', 'entregado', 'en_pausa', 'cancelado')),
    total numeric(12, 2) not null default 0 check (total >= 0),
    delivery_date date,
    notes text
);

create table if not exists cli_retainers (
    id uuid primary key default gen_random_uuid(),
    created_at timestamptz not null default now(),
    client_id uuid not null references cli_clients (id) on delete restrict,
    concept text not null,
    monthly_amount numeric(12, 2) not null check (monthly_amount > 0),
    -- Siempre el día 1 del mes. end_month es el último mes que se cobra; null = activa.
    start_month date not null,
    end_month date,
    check (end_month is null or end_month >= start_month)
);

create table if not exists cli_payments (
    id uuid primary key default gen_random_uuid(),
    created_at timestamptz not null default now(),
    client_id uuid not null references cli_clients (id) on delete restrict,
    project_id uuid references cli_projects (id) on delete restrict,
    retainer_id uuid references cli_retainers (id) on delete restrict,
    amount numeric(12, 2) not null check (amount > 0),
    paid_on date not null default current_date,
    note text,
    -- Cada pago va a un proyecto o a una mensualidad, nunca a los dos ni a ninguno.
    check ((project_id is null) <> (retainer_id is null))
);

create index if not exists cli_projects_client_idx on cli_projects (client_id);
create index if not exists cli_retainers_client_idx on cli_retainers (client_id);
create index if not exists cli_payments_client_idx on cli_payments (client_id);
create index if not exists cli_payments_project_idx on cli_payments (project_id);
create index if not exists cli_payments_retainer_idx on cli_payments (retainer_id);

-- RLS activado SIN políticas, igual que las tablas del CRM: la clave pública
-- (anon) no puede leer ni escribir nada; solo el servidor con la service role.
alter table cli_clients enable row level security;
alter table cli_projects enable row level security;
alter table cli_retainers enable row level security;
alter table cli_payments enable row level security;
