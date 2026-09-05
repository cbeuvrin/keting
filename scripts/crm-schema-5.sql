-- ═══════════════════════════════════════════════════════════════════════════
-- CRM de Keting — fase 5: ciudad y país de cada contacto
-- Pegar en Supabase → SQL Editor → Run (idempotente, como los anteriores).
-- ═══════════════════════════════════════════════════════════════════════════

-- De dónde es el contacto. Hace falta para segmentar los envíos por plaza:
-- lo que se le escribe a alguien de Guadalajara o de Monterrey no tiene por
-- qué ser lo mismo que a alguien de CDMX, y el país abre la puerta a escribir
-- fuera de México sin mezclarlo todo en la misma lista.
alter table crm_leads add column if not exists city text;
alter table crm_leads add column if not exists country text;

create index if not exists crm_leads_city_idx on crm_leads (city);
create index if not exists crm_leads_country_idx on crm_leads (country);
