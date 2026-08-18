-- ═══════════════════════════════════════════════════════════════════════════
-- CRM de Keting — fase 3: textos editables de las plantillas de correo
-- Pegar en Supabase → SQL Editor → Run (idempotente, como los anteriores).
-- ═══════════════════════════════════════════════════════════════════════════

-- Ajustes del CRM en clave-valor. Hoy guarda los textos de la plantilla de
-- campaña ('template:prototipo-web'); mañana lo que haga falta.
create table if not exists crm_settings (
    key text primary key,
    value jsonb not null,
    updated_at timestamptz not null default now()
);

alter table crm_settings enable row level security;
