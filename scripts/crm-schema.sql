-- ═══════════════════════════════════════════════════════════════════════════
-- CRM de Keting — esquema inicial
-- Pegar tal cual en Supabase → SQL Editor → Run. Es idempotente: se puede
-- ejecutar dos veces sin romper nada.
-- ═══════════════════════════════════════════════════════════════════════════

-- Leads: cada persona/empresa con la que hay una conversación comercial.
create table if not exists crm_leads (
    id uuid primary key default gen_random_uuid(),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    name text not null,
    email text,
    phone text,
    company text,
    -- de dónde salió: manual | contacto | testimonio
    source text not null default 'manual',
    -- etapa del pipeline: nuevo | contactado | propuesta | ganado | perdido
    stage text not null default 'nuevo',
    -- el mensaje original del formulario, si vino de ahí
    message text,
    -- intereses marcados en el formulario de contacto
    interests text
);

-- Notas con fecha sobre un lead ("llamé, quedamos en...", etc.)
create table if not exists crm_notes (
    id uuid primary key default gen_random_uuid(),
    lead_id uuid not null references crm_leads (id) on delete cascade,
    created_at timestamptz not null default now(),
    body text not null
);

-- Correos enviados desde el panel (via Resend), para que quede historial.
create table if not exists crm_emails (
    id uuid primary key default gen_random_uuid(),
    lead_id uuid not null references crm_leads (id) on delete cascade,
    created_at timestamptz not null default now(),
    to_email text not null,
    subject text not null,
    body text not null,
    -- id que devuelve Resend, por si hay que rastrear un envío
    resend_id text
);

create index if not exists crm_leads_stage_idx on crm_leads (stage);
create index if not exists crm_leads_email_idx on crm_leads (email);
create index if not exists crm_notes_lead_idx on crm_notes (lead_id);
create index if not exists crm_emails_lead_idx on crm_emails (lead_id);

-- RLS activado SIN políticas: la clave pública (anon) no puede leer ni
-- escribir nada. Solo el servidor, con la service role key, entra.
alter table crm_leads enable row level security;
alter table crm_notes enable row level security;
alter table crm_emails enable row level security;
