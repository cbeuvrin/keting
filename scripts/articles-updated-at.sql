-- ═══════════════════════════════════════════════════════════════════════════
-- Blog — fecha de última modificación real de cada artículo
-- Pegar en Supabase → SQL Editor → Run (idempotente).
-- ═══════════════════════════════════════════════════════════════════════════

-- La página del artículo ya lee `updated_at` y, si existe, la declara como
-- dateModified en el schema Article; el sitemap la usa como <lastmod>. Sin
-- esta columna ningún artículo podía decirle a Google ni a las IA que se
-- actualizó. Se queda vacía en los artículos ya existentes: no se conoce la
-- fecha real de sus ediciones pasadas e inventarla sería peor que no darla.
alter table public.articles add column if not exists updated_at timestamptz;

-- Se pone sola, y solo cuando cambia lo que el lector ve. Un trigger "en
-- cualquier update" no sirve aquí: cada visita suma 1 a `views` con un
-- UPDATE, y cada artículo leído pasaría por "actualizado hoy".
create or replace function public.articles_set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
    if new.content is distinct from old.content
        or new.title is distinct from old.title
        or new.excerpt is distinct from old.excerpt then
        new.updated_at := now();
    end if;
    return new;
end;
$$;

drop trigger if exists articles_set_updated_at on public.articles;
create trigger articles_set_updated_at
    before update on public.articles
    for each row execute function public.articles_set_updated_at();
