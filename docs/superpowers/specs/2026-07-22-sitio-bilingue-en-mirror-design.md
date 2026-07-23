# Diseño — Sitio bilingüe con rutas espejo `/en/*`

**Fecha:** 2026-07-22
**Proyecto:** ketingmedia.com (Next.js 16 App Router)
**Autor:** Carlos Beuvrin + Claude

## Objetivo

Convertir el sitio en bilingüe real (ES/EN) donde cada página clave tiene una
versión inglesa **indexable** en `/en/*`. El botón EN de la barra lleva a la
versión inglesa de **esa misma página** (no a una landing suelta). El inglés se
genera en el HTML estático (para SEO en Google en inglés), no solo como un
toggle de cliente.

## Alcance

**Páginas con versión en inglés (7):**

```
/en                              ← home (espejo traducido del home español)
/en/desarrollo-web
/en/desarrollo-de-software
/en/automatizacion-de-procesos
/en/portafolio
/en/aviso-de-privacidad
/en/terminos-y-condiciones
```

**Fuera de alcance:**
- El **blog** se queda solo en español (traducir decenas de artículos es un
  proyecto aparte). No hay `/en/blog`.
- No se hace un refactor a `app/[lang]/*` (blast radius enorme sobre un sitio en
  producción). Se descartó explícitamente.

## Decisiones de arquitectura

### 1. El idioma lo determina la ruta (fuente única de verdad)

`lib/i18n/lang-context.tsx` (`LangProvider`) pasa a inicializar el locale desde
`usePathname()`:

- Ruta empieza con `/en` → `lang = "en"`
- Cualquier otra → `lang = "es"`

`usePathname()` es SSR-safe y, en generación estática, devuelve la ruta que se
está renderizando. Resultado: el HTML estático de `/en/*` se genera **realmente
en inglés** (hoy no sucedería porque el provider arranca en "es").

El toggle ES/EN deja de "recordar" preferencia como fuente de verdad: `setLang`
sigue existiendo por compatibilidad, pero el idioma efectivo es el de la URL.
Los botones simplemente navegan (`router.push`) a la ruta del otro idioma.

**Nota de hidratación:** inicializar desde `usePathname()` (no desde
`localStorage`) evita mismatch de hidratación. Verificar que no quede lectura de
`localStorage` en el estado inicial que contradiga la ruta.

### 2. El texto vive en el diccionario (una sola copia por página)

- El **home** ya lee de `dictionaries.ts` → funciona en EN sin tocar JSX.
- Las **páginas de servicio y portafolio** están hoy hardcodeadas en español. Se
  mueve su contenido a `dictionaries.ts` con bloques `es` + `en`, y el
  componente pasa a leer del diccionario vía `useLang()`.
- Las rutas `/en/*` son **archivos delgados** (`app/en/<ruta>/page.tsx` +
  `layout.tsx`) que montan **el mismo componente** que la ruta española, más su
  metadata en inglés. No se duplica JSX de diseño.

Esto mantiene el patrón que ya usa el home y evita dos copias desincronizadas.

### 3. El menú se adapta al idioma

Los tres navs (`components/layout/header.tsx`, `components/gravity/header.tsx`,
`components/layout/footer.tsx`) construyen los `href` con prefijo `/en` cuando
`isEn` es true, para que navegar en inglés te mantenga en inglés.

- El ítem **Blog** se **omite** del menú en inglés (no mandar visitantes en
  inglés a artículos en español).
- El toggle ES/EN mapea la ruta actual a su gemela:
  - EN: `/desarrollo-web` → `/en/desarrollo-web`
  - ES: `/en/desarrollo-web` → `/desarrollo-web`
  - **Fallback:** si la ruta actual no tiene gemela (ej. un artículo de blog),
    EN lleva a `/en` (home inglés) y ES a `/` (home español).

### 4. SEO — hreflang recíproco por par

Cada `layout.tsx` (español e inglés) declara:

```
alternates.canonical = <su propia ruta>
alternates.languages = {
  "es-MX": <ruta española>,
  "en":    <ruta inglesa>,
  "x-default": <ruta española>,
}
```

- Se agregan las 7 rutas `/en/*` a `app/sitemap.ts`.
- Se menciona la sección inglesa en `public/llms.txt` (ya existe una entrada
  `/en`; ampliarla o listar las páginas clave).
- `next.config.js`: ya está `/en/:path+` → 308 a ES para las viejas URLs de
  WordPress. **Cuidado:** ese redirect NO debe atrapar las nuevas rutas reales
  `/en/desarrollo-web`, etc. Revisar el patrón: hoy `/en/:path+` redirige
  cualquier subruta de `/en`. Hay que **excluir** las rutas espejo nuevas o
  reemplazar el catch-all por redirects específicos de las viejas URLs de WP.
  Esta es la trampa más delicada del proyecto.

### 5. Traducciones

Claude redacta el inglés (natural, tono nearshore/profesional para EE.UU., no
traducción literal). Carlos revisa antes de publicar. El `/en` actual (landing
nearshore) se **reemplaza** por el home espejo traducido.

## Orden de implementación (para minimizar riesgo)

Página por página, validando `npm run build` completo (hasta "Generating static
pages") en cada paso para que el español nunca se rompa:

1. **Locale por ruta** en `LangProvider` (base de todo). Verificar que `/` sigue
   en español y `/en` (actual) no truena.
2. **Arreglar el redirect** de `next.config.js` para que las nuevas rutas `/en/*`
   no sean atrapadas por el catch-all de WordPress.
3. **Home `/en`**: reemplazar la landing actual por el home espejo (montar los
   mismos componentes del home; ya son dictionary-driven). Verificar EN completo.
4. **Menús adaptativos** (href con prefijo `/en`, toggle mapea ruta, Blog fuera
   del menú EN).
5. Por cada página de servicio + portafolio + legales:
   a. Mover su texto a `dictionaries.ts` (es + en).
   b. Refactor del componente para leer del diccionario.
   c. Crear `app/en/<ruta>/{page,layout}.tsx` (thin wrapper + metadata EN).
   d. hreflang recíproco en ambos `layout.tsx`.
   e. `npm run build` y verificar ES y EN.
6. **Sitemap + llms.txt** con las 7 rutas.
7. Build final, push, verificar cada `/en/*` = 200 y en inglés en producción.

## Criterios de éxito

- Cada `/en/*` devuelve 200 y su **HTML estático está en inglés** (no solo tras
  togglear en cliente). Verificable con `curl .../en/desarrollo-web | grep`.
- El botón EN en cualquier página con gemela lleva a la versión inglesa de esa
  página; en el resto, a `/en`.
- Navegar por el menú en inglés mantiene al usuario en `/en/*`.
- Las páginas en **español siguen idénticas** (sin regresiones de texto ni
  diseño).
- hreflang recíproco válido en cada par; las 7 rutas en el sitemap.
- Google Search Console sin avisos de idioma/hreflang tras re-rastreo.

## Riesgos

- **Redirect de WordPress** (`/en/:path+`) atrapando las rutas reales → 308 loop
  o 404. Es el riesgo #1; se ataca en el paso 2 y se verifica en producción.
- **Refactor de páginas al diccionario** puede introducir regresiones en
  español. Mitigación: una página a la vez + build + diff visual del español.
- **Hidratación** si el locale inicial (ruta) contradice algún estado
  persistido. Mitigación: locale 100% derivado de la ruta, sin `localStorage` en
  el estado inicial.
