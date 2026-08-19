-- ═══════════════════════════════════════════════════════════════════════════
-- CRM de Keting — fase 4: servicio de interés de cada contacto
-- Pegar en Supabase → SQL Editor → Run (idempotente, como los anteriores).
-- ═══════════════════════════════════════════════════════════════════════════

-- Qué le interesa a este contacto: web | apps | eventos | personalizado.
-- Es un eje distinto de list_name (de dónde salió) y de stage (en qué punto
-- del trato está): sirve para escribirle a cada grupo lo que le toca.
alter table crm_leads add column if not exists service text;

create index if not exists crm_leads_service_idx on crm_leads (service);
