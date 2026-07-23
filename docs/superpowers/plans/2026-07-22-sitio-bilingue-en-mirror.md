# Sitio bilingüe con rutas espejo `/en/*` — Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Que cada página clave del sitio tenga una versión inglesa indexable en `/en/*`, donde el idioma lo determina la URL y el HTML estático de `/en/*` se genera realmente en inglés.

**Architecture:** El locale se deriva de `usePathname()` en `LangProvider` (ruta `/en*` → inglés). El texto vive una sola vez en `dictionaries.ts` (bloques `es`/`en`); las rutas `/en/*` montan los mismos componentes con metadata inglesa. Los navs prefijan sus `href` con `/en` cuando la ruta es inglesa. hreflang recíproco por par de páginas.

**Tech Stack:** Next.js 16 App Router, "use client" components, framer-motion, `lib/i18n` (dictionaries + lang-context), metadata API de Next.

## Global Constraints

- **Sin framework de tests** en el proyecto. Verificación = `npm run build` completo (debe llegar a "Generating static pages") + `curl <url> | grep` para confirmar inglés en el HTML estático + revisión visual. Nunca confiar solo en "Compiled successfully" (el type-check falla después y Vercel lo rechaza).
- **El español no se rompe:** cada tarea que toca una página existente valida que la versión ES sigue idéntica (texto y diseño) antes de commit.
- **Regla global de encabezados:** `app/globals.css` pinta `h1..h4` oscuro con especificidad de elemento; en secciones de fondo oscuro hay que forzar `text-white`. No introducir h1-h4 sin color en fondos oscuros.
- **Title template:** el root `app/layout.tsx` tiene `title.template = "%s · Keting Media"`. Los `title` de layouts hijos van SIN "· Keting Media"; si el título ya lo incluye, usar `title: { absolute: "..." }`.
- **Copy en inglés:** natural, tono nearshore/profesional para EE.UU., no traducción literal. Se redacta en ejecución y **Carlos lo revisa** antes de push.
- **Commits frecuentes**, uno por tarea, en español, terminando con `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.

---

## Estructura de archivos

**Se modifican (infraestructura):**
- `lib/i18n/lang-context.tsx` — locale derivado de la ruta.
- `next.config.js` — el catch-all `/en/:path+` deja de atrapar las rutas espejo reales.
- `components/layout/header.tsx`, `components/gravity/header.tsx`, `components/layout/footer.tsx` — `href` adaptativos + mapeo del toggle.
- `lib/i18n/routes.ts` (**crear**) — helpers puros de mapeo ES↔EN de rutas (una sola fuente de verdad, testeable, reutilizada por los 3 navs).
- `app/sitemap.ts` — 7 rutas `/en/*`.
- `public/llms.txt` — sección inglesa.
- `app/layout.tsx` y cada `app/<ruta>/layout.tsx` español — `alternates.languages` recíproco.

**Se crean (por página):**
- `app/en/layout.tsx` (ya existe; se ajusta) y `app/en/page.tsx` (ya existe; se **reemplaza** por el home espejo).
- `app/en/desarrollo-web/{page,layout}.tsx`
- `app/en/desarrollo-de-software/{page,layout}.tsx`
- `app/en/automatizacion-de-procesos/{page,layout}.tsx`
- `app/en/portafolio/{page,layout}.tsx`
- `app/en/aviso-de-privacidad/{page,layout}.tsx`
- `app/en/terminos-y-condiciones/{page,layout}.tsx`

**Diccionario:** `lib/i18n/dictionaries.ts` crece con los bloques de cada página (servicios, portafolio, legales) en `es` y `en`.

---

## FASE 1 — Infraestructura + Home (entregable independiente y shippable)

Al terminar la Fase 1, `/en` muestra el home espejo en inglés (el home ya es dictionary-driven), el toggle mapea rutas, y el redirect no rompe las rutas nuevas. Se puede desplegar solo.

### Task 1: Locale derivado de la ruta en `LangProvider`

**Files:**
- Modify: `lib/i18n/lang-context.tsx`

**Interfaces:**
- Produces: `useLang()` devuelve `lang` derivado de la ruta actual; `t = dictionaries[lang]`. Firma sin cambios (`{ lang, setLang, t }`).

- [ ] **Step 1: Reescribir el provider para derivar el locale de la ruta**

Reemplazar el cuerpo de `LangProvider` por lo siguiente (mantiene `setLang` por compatibilidad, pero la ruta manda):

```tsx
"use client";

import { createContext, useContext, useEffect } from "react";
import { usePathname } from "next/navigation";
import { dictionaries, type Dictionary, type Lang } from "./dictionaries";

type LangContextValue = {
    lang: Lang;
    setLang: (lang: Lang) => void;
    t: Dictionary;
};

const LangContext = createContext<LangContextValue>({
    lang: "es",
    setLang: () => {},
    t: dictionaries.es,
});

export function LangProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    // El idioma lo manda la URL: /en o /en/... => inglés; el resto => español.
    const lang: Lang = pathname === "/en" || pathname?.startsWith("/en/") ? "en" : "es";

    // Mantener el atributo lang del <html> sincronizado (a11y + SEO).
    useEffect(() => {
        document.documentElement.lang = lang === "en" ? "en" : "es-MX";
    }, [lang]);

    // setLang se conserva como no-op de estado (la navegación cambia el idioma);
    // los navs siguen llamándolo antes de router.push sin efecto adverso.
    const value: LangContextValue = {
        lang,
        setLang: () => {},
        t: dictionaries[lang],
    };

    return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang(): LangContextValue {
    return useContext(LangContext);
}
```

Nota: se elimina el estado `useState`/`localStorage` y el gate `hydrated`. El locale es determinista por ruta, así que el HTML estático de `/en*` sale en inglés y no hay mismatch de hidratación (server y client ven el mismo `pathname`).

- [ ] **Step 2: Verificar build**

Run: `npm run build`
Expected: llega a "✓ Generating static pages"; sin errores de tipo.

- [ ] **Step 3: Verificar que el home español sigue en español y /en (actual) no truena**

Run:
```bash
npm run build && \
  grep -o 'Desarrollo\|Automatización' .next/server/app/index.html | head -1 && \
  test -f .next/server/app/en.html && echo "/en OK"
```
Expected: aparece texto español en `index.html`; `/en OK`.

- [ ] **Step 4: Commit**

```bash
git add lib/i18n/lang-context.tsx
git commit -m "i18n: el idioma lo determina la ruta (/en* => inglés)

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 2: Helpers puros de mapeo de rutas ES↔EN

**Files:**
- Create: `lib/i18n/routes.ts`

**Interfaces:**
- Produces:
  - `EN_MIRRORED: string[]` — rutas español que tienen gemela inglesa (sin prefijo, ej. `"/desarrollo-web"`, `""` para home).
  - `toEn(pathname: string): string` — devuelve la ruta inglesa equivalente; si no hay gemela, `"/en"`.
  - `toEs(pathname: string): string` — devuelve la ruta española equivalente; si no hay gemela, `"/"`.
  - `enHref(esPath: string, isEn: boolean): string` — para navs: si `isEn`, prefija `/en`; si no, deja `esPath`. Home (`"/"`) → `"/en"` cuando isEn.

- [ ] **Step 1: Crear el módulo de rutas**

```ts
// Mapeo de rutas entre español (raíz) e inglés (prefijo /en).
// Fuente única de verdad para el toggle y los enlaces de los navs.

// Rutas ES con gemela EN. "" representa el home ("/").
export const EN_MIRRORED = [
    "",
    "/desarrollo-web",
    "/desarrollo-de-software",
    "/automatizacion-de-procesos",
    "/portafolio",
    "/aviso-de-privacidad",
    "/terminos-y-condiciones",
] as const;

function normalizeEs(pathname: string): string {
    // Quita el prefijo /en si viene una ruta inglesa.
    if (pathname === "/en") return "/";
    if (pathname.startsWith("/en/")) return pathname.slice(3); // "/en/x" -> "/x"
    return pathname;
}

function hasMirror(esPath: string): boolean {
    const key = esPath === "/" ? "" : esPath;
    return (EN_MIRRORED as readonly string[]).includes(key);
}

// Ruta actual -> su equivalente en inglés (o /en si no hay gemela).
export function toEn(pathname: string): string {
    const es = normalizeEs(pathname);
    if (!hasMirror(es)) return "/en";
    return es === "/" ? "/en" : `/en${es}`;
}

// Ruta actual -> su equivalente en español (o / si no hay gemela).
export function toEs(pathname: string): string {
    const es = normalizeEs(pathname);
    if (!hasMirror(es)) return "/";
    return es;
}

// Para los navs: dado un href español fijo, devuelve el correcto según idioma.
export function enHref(esPath: string, isEn: boolean): string {
    if (!isEn) return esPath;
    if (esPath === "/" || esPath === "/#home") return "/en";
    return `/en${esPath}`;
}
```

- [ ] **Step 2: Verificar tipos en build**

Run: `npx tsc --noEmit`
Expected: sin errores.

- [ ] **Step 3: Commit**

```bash
git add lib/i18n/routes.ts
git commit -m "i18n: helpers de mapeo de rutas ES/EN (toEn, toEs, enHref)

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 3: Arreglar el redirect catch-all de WordPress

**Files:**
- Modify: `next.config.js:85-94`

**Contexto:** Hoy `{ source: '/en/:path+', destination: '/', permanent: true }` atrapa CUALQUIER subruta de `/en`, incluidas las nuevas rutas reales (`/en/desarrollo-web`, etc.). Hay que reemplazar el catch-all por redirects específicos de las viejas URLs de WordPress que aún queramos preservar, y dejar pasar las rutas espejo reales.

- [ ] **Step 1: Reemplazar el catch-all por redirects específicos**

En el bloque de "Versión en inglés", quitar la línea `{ source: '/en/:path+', ... }` y dejar SOLO redirects concretos de URLs viejas que no son rutas espejo. El bloque queda:

```js
      // Versión en inglés antigua de WordPress: redirects ESPECÍFICOS (no
      // catch-all, para no atrapar las rutas espejo reales /en/desarrollo-web…).
      { source: '/en/blog/:path*', destination: '/blog', permanent: true },
      { source: '/en/blog', destination: '/blog', permanent: true },
      { source: '/en/web', destination: '/en/desarrollo-web', permanent: true },
      { source: '/en/portafolio-web', destination: '/en/portafolio', permanent: true },
      { source: '/en/google-ads', destination: '/en/desarrollo-de-software', permanent: true },
      { source: '/en/meta-ads', destination: '/en/desarrollo-de-software', permanent: true },
      { source: '/en/blogger', destination: '/blog', permanent: true },
      { source: '/en/nosotros', destination: '/en', permanent: true },
```

(Se eliminan `/en/:path+` y se re-apuntan las viejas URLs a sus gemelas inglesas cuando existan.)

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: "✓ Generating static pages", sin error.

- [ ] **Step 3: Commit**

```bash
git add next.config.js
git commit -m "redirects: quitar catch-all /en/:path+ para no atrapar rutas espejo reales

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 4: Home espejo en `/en`

**Files:**
- Modify: `app/en/page.tsx` (reemplazar la landing nearshore por el home espejo)
- Modify: `app/en/layout.tsx` (ajustar metadata para "home", conservar hreflang)

**Interfaces:**
- Consumes: los componentes del home (`Hero`, `Services`, `DigitalSolutions`, `AutomationHome`, `Toogo`, `AboutUs`, `Footer`, `Header`) — todos dictionary-driven vía `useLang()`, que ahora devuelve `en` bajo `/en` (Task 1).

- [ ] **Step 1: Reemplazar `app/en/page.tsx` por el mismo árbol que el home**

Copiar el cuerpo de `app/page.tsx` (el componente `Home`) a `app/en/page.tsx` sin cambios de estructura (mismos imports, mismo JSX). Como `useLang()` devuelve `en` bajo `/en`, todo el texto sale en inglés desde el diccionario. Renombrar el export a `EnHome` para claridad.

- [ ] **Step 2: Ajustar `app/en/layout.tsx`**

Mantener el bloque hreflang existente (`es-MX: "/"`, `en: "/en"`, `x-default: "/"`) y el JSON-LD. Conservar `title: { absolute: "..." }`. Verificar que el `title` describe el home en inglés.

- [ ] **Step 3: Build + verificar inglés en el HTML estático del home /en**

Run:
```bash
npm run build && \
  grep -o '<html lang="[^"]*"' .next/server/app/en.html | head -1 && \
  grep -ci 'software\|development\|web' .next/server/app/en.html
```
Expected: el HTML de `/en` contiene texto en inglés del home; conteo > 0.

- [ ] **Step 4: Revisión visual (dev server)**

Run: `npm run dev`, abrir `http://localhost:3000/en` y `http://localhost:3000/`.
Expected: `/en` = home en inglés; `/` = home en español, sin cambios.

- [ ] **Step 5: Commit**

```bash
git add app/en/page.tsx app/en/layout.tsx
git commit -m "/en: home espejo en inglés (reemplaza landing nearshore)

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 5: Navs adaptativos (href con prefijo /en + toggle mapea la ruta actual)

**Files:**
- Modify: `components/layout/header.tsx`
- Modify: `components/gravity/header.tsx`
- Modify: `components/layout/footer.tsx`

**Interfaces:**
- Consumes: `enHref`, `toEn`, `toEs` de `lib/i18n/routes.ts`; `usePathname()`, `useRouter()` (ya importados en los 3 tras trabajo previo).

- [ ] **Step 1: `header.tsx` — enlaces del menú con prefijo y toggle por ruta**

Importar helpers:
```tsx
import { enHref, toEn, toEs } from "@/lib/i18n/routes";
```
En `menuItems`, envolver cada `href` con `enHref(href, isEn)`. Quitar el ítem **Blog** cuando `isEn` (filtrar). Cambiar los `onClick` del toggle:
```tsx
onClick={() => router.push(toEs(pathname ?? "/"))}   // botón ES
onClick={() => router.push(toEn(pathname ?? "/"))}   // botón EN
```
(Se elimina la dependencia de `setLang` para navegar; el idioma lo fija la ruta destino.)

- [ ] **Step 2: `gravity/header.tsx` — mismo patrón**

Envolver los `href` de los links (`/desarrollo-web`, `/desarrollo-de-software`, `/automatizacion-de-procesos`, `/portafolio`) con `enHref(..., isEn)`; quitar Blog si aplica; toggle usa `toEs`/`toEn` con `pathname`.

- [ ] **Step 3: `footer.tsx` — mismo patrón**

Envolver los `href` de navegación con `enHref(..., isEn)`; toggle usa `toEs`/`toEn`.

- [ ] **Step 4: Build + verificación**

Run: `npm run build`
Expected: "✓ Generating static pages".

Revisión visual: en `/en`, abrir el menú → los enlaces apuntan a `/en/...`; el botón ES en `/en` regresa a `/`.

- [ ] **Step 5: Commit**

```bash
git add components/layout/header.tsx components/gravity/header.tsx components/layout/footer.tsx
git commit -m "navs: enlaces con prefijo /en en inglés + toggle mapea la ruta actual

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 6: hreflang recíproco del home + sitemap + llms.txt (cierre de Fase 1)

**Files:**
- Modify: `app/layout.tsx` (ya tiene `es-MX ↔ en ↔ x-default`; verificar)
- Modify: `app/sitemap.ts`
- Modify: `public/llms.txt`

- [ ] **Step 1: Confirmar hreflang del root** (ya hecho en trabajo previo; verificar que `alternates.languages` = `{ "es-MX": "/", "en": "/en", "x-default": "/" }`).

- [ ] **Step 2: Agregar las 6 rutas de servicio/portafolio/legales a `app/sitemap.ts`**

Añadir (además del `/en` ya presente):
```ts
{ url: `${SITE_URL}/en/desarrollo-web`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
{ url: `${SITE_URL}/en/desarrollo-de-software`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
{ url: `${SITE_URL}/en/automatizacion-de-procesos`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
{ url: `${SITE_URL}/en/portafolio`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.75 },
{ url: `${SITE_URL}/en/aviso-de-privacidad`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
{ url: `${SITE_URL}/en/terminos-y-condiciones`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
```
(Estas rutas aún no existen hasta las Fases 2-3; se agregan al sitemap conforme se van creando. En Fase 1, agregar SOLO las que ya existen para no listar 404. Regla: cada página que se crea en las Fases 2-3 añade su línea en el mismo commit.)

- [ ] **Step 3: Build + push de Fase 1**

Run: `npm run build`
Expected: "✓ Generating static pages".

- [ ] **Step 4: Commit + push**

```bash
git add app/sitemap.ts public/llms.txt app/layout.tsx
git commit -m "SEO: hreflang home + sitemap/llms preparados para /en (Fase 1)

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
git push origin main
```

- [ ] **Step 5: Verificar en producción**

Run (tras el deploy):
```bash
curl -s -o /dev/null -w '%{http_code}\n' https://ketingmedia.com/en
curl -s https://ketingmedia.com/en | grep -o '<title>[^<]*</title>'
```
Expected: 200; título del home en inglés.

---

## FASE 2 — Páginas de servicio (una página = un incremento shippable)

Cada página de servicio se hace con la **misma receta**. El copy inglés se redacta en ejecución y **Carlos lo revisa antes de push**.

### Receta por página de servicio (repetir para las 3)

Aplica a: `desarrollo-web`, `desarrollo-de-software`, `automatizacion-de-procesos`.

**Files (por página `<ruta>`):**
- Modify: `app/<ruta>/*.tsx` (page + sub-componentes locales) — leer texto del diccionario.
- Modify: `lib/i18n/dictionaries.ts` — bloque nuevo `<ruta>` en `es` y `en`.
- Modify: `app/<ruta>/layout.tsx` — hreflang recíproco.
- Create: `app/en/<ruta>/page.tsx` — thin wrapper que monta el mismo componente de página.
- Create: `app/en/<ruta>/layout.tsx` — metadata inglesa + hreflang recíproco + JSON-LD.
- Modify: `app/sitemap.ts` — línea `/en/<ruta>`.

- [ ] **Step 1: Inventariar los strings hardcodeados de la página**

Run: `grep -rn '"[A-ZÁÉÍÓÚ]' app/<ruta>/ | grep -v import | grep -v className` para listar prosa española en la página y sus sub-componentes (`GravityHero`, `TextSection`, `EcommerceSection`, `LandingSection`, secciones FAQ, etc.).

- [ ] **Step 2: Añadir el bloque al diccionario**

En `lib/i18n/dictionaries.ts`, dentro de `es` y `en`, añadir una clave por página (ej. `webPage`, `softwarePage`, `automationPage`) con sub-claves para cada string inventariado. El `es` copia el texto español actual **verbatim** (para no cambiar la página española); el `en` es la traducción natural (a revisar por Carlos).

- [ ] **Step 3: Refactor de los componentes para leer del diccionario**

En la página y cada sub-componente, reemplazar el string hardcodeado por `const { t } = useLang();` + `t.<pageKey>.<subKey>`. Añadir `"use client"` solo si el sub-componente no lo tenía y ahora usa el hook (los sub-componentes SSR que deben quedar en el HTML —`TextSection`, `GravityHero`, listas de servicios— ya son client o se mantienen renderizando su prosa; verificar que el texto sigue en el HTML estático).

- [ ] **Step 4: Verificar que el español no cambió**

Run:
```bash
npm run build && npm run dev
```
Abrir `http://localhost:3000/<ruta>` y comparar visualmente contra `git stash`/producción: texto y diseño idénticos.

- [ ] **Step 5: Crear la ruta espejo inglesa**

`app/en/<ruta>/page.tsx`: importa y renderiza el mismo componente de página que `app/<ruta>/page.tsx` (export default que retorna `<ComponentePagina />`). Como está bajo `/en`, `useLang()` devuelve `en` → inglés.

`app/en/<ruta>/layout.tsx`: metadata inglesa (title sin duplicar sufijo; description; keywords nearshore), `alternates.canonical = "/en/<ruta>"`, `alternates.languages = { "es-MX": "/<ruta>", "en": "/en/<ruta>", "x-default": "/<ruta>" }`, y JSON-LD `service` + `breadcrumb` en inglés.

- [ ] **Step 6: hreflang recíproco en el layout español**

En `app/<ruta>/layout.tsx`, fijar `alternates.languages = { "es-MX": "/<ruta>", "en": "/en/<ruta>", "x-default": "/<ruta>" }`.

- [ ] **Step 7: Sitemap + build + verificación de inglés en HTML estático**

Añadir la línea `/en/<ruta>` a `app/sitemap.ts`. Luego:
```bash
npm run build && \
  grep -ci 'development\|software\|process\|automation' .next/server/app/en/<ruta>.html
```
Expected: > 0 (la prosa inglesa está en el HTML estático, no solo tras toggle).

- [ ] **Step 8: Commit (tras revisión de copy por Carlos)**

```bash
git add app/<ruta> app/en/<ruta> lib/i18n/dictionaries.ts app/sitemap.ts
git commit -m "/en/<ruta>: versión inglesa (contenido al diccionario ES/EN)

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

**Orden sugerido:** `desarrollo-web` (más sub-componentes, marca el patrón) → `desarrollo-de-software` → `automatizacion-de-procesos`.

---

## FASE 3 — Portafolio y legales

### Task 7: `/en/portafolio`

Misma receta que Fase 2 sobre `app/portafolio/`. El portafolio tiene menos prosa (nombres de proyecto se mantienen; se traducen descripciones y encabezados). Crear `app/en/portafolio/{page,layout}.tsx`, bloque `portfolioPage` en el diccionario, hreflang recíproco, sitemap. Verificar inglés en `.next/server/app/en/portafolio.html`.

### Task 8: `/en/aviso-de-privacidad` y `/en/terminos-y-condiciones`

Legales: prosa larga pero estática. Misma receta. Como es texto denso, se puede añadir el contenido inglés directamente en el diccionario (`privacyPage`, `termsPage`) con sub-claves por sección/párrafo. hreflang recíproco + sitemap. Verificar inglés en el HTML estático.

**Nota legal:** revisar que la traducción del aviso de privacidad no altere el sentido jurídico (Carlos valida). Mantener la versión española como la vinculante si hay duda; se puede añadir una línea "The Spanish version prevails" al pie del aviso inglés.

---

## FASE 4 — Cierre

### Task 9: Verificación integral + Search Console

- [ ] **Step 1:** `npm run build` final; confirmar que las 7 rutas `/en/*` aparecen en la salida como estáticas.
- [ ] **Step 2:** Push; tras deploy, `curl` a las 7 rutas → 200 y HTML en inglés (grep).
- [ ] **Step 3:** Verificar hreflang recíproco: `curl -s <par ES> | grep hreflang` y `<par EN>` deben apuntarse mutuamente.
- [ ] **Step 4 (Carlos):** en Search Console, reenviar sitemap y solicitar indexación de las 7 rutas `/en/*`.

---

## Self-Review (cobertura del spec)

- **Idioma por ruta** → Task 1. ✓
- **Rutas espejo (7)** → Task 4 (home) + Fase 2 (3 servicios) + Fase 3 (portafolio + 2 legales). ✓
- **Texto en diccionario, sin duplicar JSX** → receta Fase 2/3 (bloques `es`/`en`, thin wrappers `/en/*`). ✓
- **Menú adaptativo + Blog fuera del EN** → Task 5. ✓
- **Toggle mapea ruta con fallback** → Task 2 (helpers) + Task 5 (uso). ✓
- **hreflang recíproco por par** → Task 6 (home) + Steps 5-6 de la receta + Task 8. ✓
- **Sitemap + llms.txt** → Task 6 + línea por página en cada creación. ✓
- **Redirect WordPress no atrapa rutas reales** (riesgo #1) → Task 3. ✓
- **Español sin regresiones** → Step 4 de la receta (comparación visual) + Global Constraints. ✓
- **/en actual reemplazado por home espejo** → Task 4. ✓
- **Copy revisado por Carlos** → Global Constraints + Step 8. ✓
