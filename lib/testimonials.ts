// Testimonios reales de clientes. FUENTE ÚNICA.
//
// Antes vivían dentro de `lib/case-studies.ts`, en el campo `quote` de cada
// caso. Eso funcionaba mientras todo testimonio perteneciera a uno de los nueve
// casos publicados — y dejó de funcionar en cuanto llegó el primero de un
// proyecto que no tiene página propia (Re-Dress, todavía en desarrollo). El
// testimonio se quedaba sin ningún sitio donde vivir.
//
// Ahora la lista es independiente. `caseSlug` es OPCIONAL: si está, el
// testimonio sale también en la página de ese caso; si no está, sale solo en la
// sección del home. Añadir un testimonio nuevo es añadir una entrada aquí, y
// nada más.
//
// ⚠️ REGLA DEL PROYECTO: aquí solo entra lo que un cliente escribió de verdad,
// por el formulario de /testimonio y con la casilla de autorización marcada. No
// se inventa ninguno, no se "mejora" la redacción y no se rellenan huecos. Se
// corrigen erratas evidentes y nada más; cuando se corrige algo, se anota.

export type Testimonial = {
    /** Literal del cliente. Solo se tocan erratas obvias, y se documenta cuál. */
    text: string;
    name: string;
    role: string;
    company: string;
    /** Qué le construimos. Se muestra como contexto en la sección del home. */
    project: string;
    /** Fecha de recepción por /testimonio (ISO). Para ordenar y para trazabilidad. */
    received: string;
    /** Slug del caso, si el proyecto tiene página propia. */
    caseSlug?: string;
    /**
     * Métrica destacada. Se COPIA de la del caso (lib/case-studies.ts) en lugar
     * de importarla: ese fichero lleva los nueve casos en dos idiomas y meterlo
     * en un componente de cliente lo mandaría entero al bundle del home.
     * Si cambias la métrica de un caso, cámbiala también aquí.
     *
     * Sin métrica cuando no hay caso: NO se inventa un número para rellenar la
     * columna. El componente pone el asterisco de la marca en su lugar.
     */
    metric?: { value: string; label: { es: string; en: string } };
    /** Stack/servicios visibles. Los de los casos vienen de su `stack`. */
    tags?: { es: string[]; en: string[] };
};

export const TESTIMONIALS: readonly Testimonial[] = [
    {
        // Erratas corregidas: "siemore" -> "siempre", "como" -> "cómo", punto final.
        text: "Todo perfecto, los cambios y las propuestas de cómo hacer las cosas siempre fueron en pro del evento y de hacerlo mejor.",
        name: "Rodrigo Juárez",
        role: "Productor",
        company: "Enso Media",
        project: "App de activación para el evento de Suzuki",
        received: "2026-07-30",
        caseSlug: "suzuki",
        metric: { value: "500+", label: { es: "Quizzes en el evento", en: "Quizzes at the event" } },
        tags: { es: ["App de evento", "Quiz interactivo", "iPad"], en: ["Event app", "Interactive quiz", "iPad"] },
    },
    {
        // Literal, sin correcciones.
        //
        // Escribió "Sebastián" como nombre y "Moncayo" como empresa, pero su
        // correo es moncayo@iudex.mx: puso el apellido en la casilla equivocada.
        // Carlos lo confirmó el 2026-07-30.
        text: "Un cambio necesario para nuestra imagen de marca. Nuestra página web cubrió exactamente lo que necesitábamos.",
        name: "Sebastián Moncayo",
        role: "CEO",
        company: "Iudex",
        project: "Página web y estrategia",
        received: "2026-07-30",
        caseSlug: "iudex",
        metric: { value: "100k+", label: { es: "Sesiones mes", en: "Sessions/mo" } },
        tags: { es: ["Next.js", "Integración de IA", "Editorial"], en: ["Next.js", "AI Integration", "Editorial"] },
    },
    {
        // Solo se añadió el punto final. La frase que empieza por "Y" es suya.
        text: "No teníamos un sitio web para comercializar nuestros productos en línea. Y el equipo de Keting Media nos asesoró y nos apoyó en la construcción del sitio, de manera profesional y rápida. Luego también nos ofreció su soporte de mantenimiento. Muy contentos.",
        name: "Andrés Bustillos",
        role: "Director comercial",
        company: "Rosymar González Joyas",
        project: "E-commerce de joyería",
        received: "2026-07-31",
        caseSlug: "rosymar-gonzalez",
        metric: { value: "↑ 5x", label: { es: "Ventas online", en: "Online sales" } },
        tags: { es: ["E-commerce", "Tema a medida", "Tienda"], en: ["E-commerce", "Custom theme", "Store"] },
    },
    {
        // Erratas corregidas: "metodologia" -> "metodología". Se retira el emoji
        // final, que no encaja con la tipografía de la sección; el texto no cambia.
        //
        // SIN caseSlug a propósito: Re-Dress sigue en desarrollo (agosto 2026) y
        // todavía no tiene página de caso. Cuando la tenga, se añade el slug aquí
        // y el testimonio aparece en los dos sitios sin tocar nada más.
        text: "Carlos me ayudó con un proyecto ya comenzado y luego hicimos un proyecto completo en conjunto con muy buena respuesta y tiempos por su parte. Súper satisfecho con su metodología de trabajo y desarrollo (además de ser gran persona).",
        name: "Manuel Santamaria",
        role: "Fundador y CEO",
        company: "Anexa",
        project: "E-commerce para Re-Dress",
        received: "2026-08-03",
        // Sin `metric` a propósito: Re-Dress no tiene caso publicado y por tanto
        // no hay una cifra verificada que enseñar. Antes que rellenar el hueco
        // con un número, el hueco se queda.
        tags: { es: ["E-commerce", "Agencia"], en: ["E-commerce", "Agency"] },
    },
    {
        // Erratas de acentuación corregidas: "habia", "pagina", "mas interes"
        // -> "había", "página", "más interés". No se toca nada más: "Ketingmedia"
        // en una palabra es como él escribe la marca, y la concordancia de
        // "no estaba actualizado" es suya.
        //
        // SIN caseSlug ni metric: WSO aparece en la tira de logos pero no tiene
        // página de caso, así que no hay cifra verificada que enseñar. Antes que
        // inventar un número, el hueco se queda — igual que con Anexa.
        text: "Antes de Ketingmedia, no había mucha visibilidad en nuestra página y no estaba actualizado. Con Keting, hemos podido generar más interés y más invitaciones para presentar nuestros servicios y productos.",
        name: "Nelson Vergara",
        role: "Director Ejecutivo Norteamérica",
        company: "WSO Worldwide Security Options",
        project: "Rediseño web y blogs profesionales",
        received: "2026-08-21",
        tags: { es: ["Rediseño web", "Blog corporativo"], en: ["Web redesign", "Corporate blog"] },
    },
];

/** El testimonio de un caso concreto, si lo tiene. Lo usa la página de caso. */
export function getTestimonialForCase(slug: string): Testimonial | undefined {
    return TESTIMONIALS.find((t) => t.caseSlug === slug);
}
