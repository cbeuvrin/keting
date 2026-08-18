-- ═══════════════════════════════════════════════════════════════════════════
-- CRM de Keting — fase 2: listas, bajas y aperturas
-- Pegar en Supabase → SQL Editor → Run (idempotente, como el primero).
-- ═══════════════════════════════════════════════════════════════════════════

-- Lista a la que pertenece el lead (se asigna al importar un CSV).
alter table crm_leads add column if not exists list_name text;

-- Baja: si es true, el CRM se niega a enviarle correos.
alter table crm_leads add column if not exists unsubscribed boolean not null default false;

-- Momento en que el destinatario abrió el correo (pixel de seguimiento).
alter table crm_emails add column if not exists opened_at timestamptz;

create index if not exists crm_leads_list_idx on crm_leads (list_name);
