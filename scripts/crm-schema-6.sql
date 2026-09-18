-- ═══════════════════════════════════════════════════════════════════════════
-- CRM de Keting — fase 6: seguimiento a quien abrió y no respondió
-- Pegar en Supabase → SQL Editor → Run (idempotente, como los anteriores).
-- ═══════════════════════════════════════════════════════════════════════════

-- Qué tipo de correo es: el primer contacto en frío, o el recordatorio corto
-- que sale después si lo abrió y no respondió. Las filas ya existentes son
-- todas 'inicial' — es lo único que se mandaba hasta ahora.
alter table crm_emails add column if not exists kind text not null default 'inicial';

create index if not exists crm_emails_kind_idx on crm_emails (lead_id, kind);
