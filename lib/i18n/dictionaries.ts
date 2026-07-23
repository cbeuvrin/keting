/**
 * Diccionarios manuales ES/EN para Keting Media.
 * Estructurados por sección para facilitar el mantenimiento.
 *
 * Cómo añadir más textos: agrega la clave en `es` y en `en` (misma forma),
 * luego usa `const { t } = useLang(); t.seccion.clave` en el componente.
 */

const es = {
    nav: {
        home: "Inicio",
        webdesign: "Diseño web",
        webdesignShort: "Diseño",
        digital: "Desarrollo de software",
        digitalShort: "Software",
        automation: "Automatización",
        automationShort: "IA",
        price: "Precio",
        portfolio: "Portafolio",
        blog: "Blog",
        contact: "Contacto",
        menu: "Menú",
        letsTalk: "Hablemos",
        idiom: "Idioma",
    },
    common: {
        live: "Live",
        scroll: "Scroll",
        loading: "Cargando…",
        more: "Más información",
        manifesto: "Manifiesto",
        clients: "Clientes",
        testimonials: "Testimonios",
        whatWeDo: "Lo que hacemos",
        selectedWork: "Trabajo selecto",
        cookies: "Cookies",
        and: "y",
    },
    cookie: {
        text: "Usamos cookies para mejorar tu experiencia y analizar el tráfico.",
        moreInfo: "Más información",
        accept: "Aceptar",
        reject: "Rechazar",
    },
    contact: {
        title: "Conecta con el equipo",
        interestQuestion: "¿En qué podemos ayudarte?",
        interests: {
            web: "Diseño Web",
            price: "Precio",
            digital: "Solución digital",
        },
        name: "Nombre*",
        namePh: "Tu nombre",
        email: "Correo electrónico*",
        emailPh: "Correo electrónico",
        phone: "Celular*",
        message: "Mensaje",
        send: "Enviar Mensaje",
        sending: "Enviando…",
        sent: "¡Enviado!",
        error: "Error al enviar",
        workingIn: "Trabajando en México",
        contactDirectly: "Contáctanos directamente",
        close: "Cerrar",
    },
    hero: {
        eyebrow: "Diseño y desarrollo digital",
        title: "Desarrollo de software, web y apps que escalan tu ambición.",
        titleStyles: {
            playfair: ["software", "apps"],
            italic: ["escalan"],
            underlined: ["ambición"],
        },
        stats: {
            prefix: "Más del",
            stat: "80%",
            middle: "de nuestros",
            projects: "proyectos",
            are: "son",
            referred: "referidos",
            line2: "por clientes anteriores que conocen",
            line3: "nuestro trabajo y compromiso.",
        },
        cta: "Hablemos",
    },
    services: {
        eyebrow: "01 · Servicio",
        title: "Diseño",
        titleItalic: "web",
        descIntro: "Desarrollamos",
        descTags: ["e-commerce", "plataformas", "landing pages"],
        descTail:
            ". Fusionamos diseño editorial con SEO técnico y rendimiento para escalar tu negocio.",
    },
    automationHome: {
        eyebrow: "03 · Servicio",
        title: "Automatización",
        titleItalic: "con IA",
        subtitle: "Procesos que se hacen solos",
        description:
            "Tu equipo pierde horas en tareas repetitivas. Automatizamos tus procesos con flujos, agentes de IA y asistentes en WhatsApp conectados a tus sistemas — para que la operación corra sola y tu gente se dedique a lo que necesita criterio humano.",
        tags: ["Agentes", "Flujos", "WhatsApp"],
    },
    digital: {
        eyebrow: "02 · Servicio",
        title: "Soluciones",
        titleItalic: "digitales",
        subtitle: "Apps hiper-personalizadas",
        description:
            "Transformamos negocios digitales globales mediante soluciones innovadoras que integran inteligencia artificial, optimizando la experiencia del usuario, automatizando procesos y maximizando resultados con tecnología avanzada.",
    },
    toogo: {
        eyebrow: "Caso · Toogo",
    },
    about: {
        eyebrow: "Nosotros",
        title: "Creando el futuro",
        titleItalic: "digital",
        subline1: "en",
        mexico: "México",
        subline2: "desde",
        year: "2019",
        subline3: ". Diseño e innovación impulsada por",
        ai: "IA",
        subline4: "para proyectos que rompen el molde.",
        quoteEyebrow: "Manifiesto",
        quote:
            "Me enfoco en trabajar con marcas que buscan escalar su negocio mediante soluciones innovadoras y un diseño que realmente conecta con sus clientes.",
        quoteAuthor: "— Carlos Beuvrin",
    },
    blog: {
        eyebrow: "Blog & Recursos",
        title1: "Ideas que",
        title2: "inspiran",
        hintLeft: "Arrastra",
        hintMid: "o",
        hintRight: "usa las flechas",
    },
    brands: {
        eyebrow: "Algunos de los nuestros",
        title1: "Construido para",
        titleItalic: "marcas",
        title2: "que cambian su industria.",
        stat1: "10+ marcas",
        stat2: "8 industrias",
    },
    webdesign: {
        manifestoEyebrow: "Manifiesto",
        manifestoIntro: "Como",
        aiEngineer: "AI Engineer",
        manifesto1:
            ", diseñamos y estructuramos soluciones digitales precisas, desde tiendas en línea hasta plataformas de cursos. Nos especializamos en",
        webDev: "desarrollo web",
        manifesto2:
            ", SEO y optimización de velocidad, construyendo sitios sólidos y eficientes que impulsan el",
        realGrowth: "crecimiento real",
        manifesto3: "de tu negocio.",
        carlos: "Carlos Beuvrin",
        carlosRole: "Programador",
        textSection1: "Como",
        agencyDigital: "expertos",
        textSection2:
            "en creación de sitios web, Keting le ofrece servicios a medida para potenciar su presencia online. Combinamos",
        creativity: "creatividad",
        textSection3: ", pensamiento estratégico y",
        technology: "tecnología",
        textSection4:
            "para crear soluciones personalizadas que contribuirán a su éxito.",
        productEyebrow: "Producto entregado",
        productCaption: "Web responsive · Producción 2026",
        portfolioCta: "Ver",
        portfolioCtaItalic: "portafolio",
        clientsTitle1: "Marcas que",
        clientsItalic: "confían",
        clientsTitle2: "en nosotros",
        clientsSubtitle1: "Cada",
        collaboration: "colaboración",
        clientsSubtitle2: ", una historia que escala.",
        testimonialsTitle1: "¿Y qué",
        testimonialsItalic: "dicen",
        testimonialsTitle2: "nuestros clientes?",
        testimonialsSubtitleResults: "Resultados",
        testimonialsSubtitle1: "reales para",
        testimonialsSubtitleBrands: "marcas",
        testimonialsSubtitle2: "reales.",
        servicesTitleDesign: "Diseño",
        servicesTitleDev: "Desarrollo",
    },
    webPage: {
        hero: {
            h1: "Diseño y desarrollo web a medida en México",
            badge: "World Wide Web",
            drag: "arrástralas",
            cornerPre: "Diseño ",
            cornerItalic: "web",
            cornerSuffix: " · 2026",
            scroll: "Scroll",
            eyebrow: "Manifiesto",
            manifestoPre: "Como ",
            manifestoRole: "AI Engineer",
            manifestoMid: ", diseño y estructuro ",
            manifestoSolutions: "soluciones digitales",
            manifestoMid2:
                " precisas, desde tiendas en línea hasta plataformas de cursos. Me especializo en ",
            manifestoSpecialty: "desarrollo web",
            manifestoMid3:
                ", SEO y optimización de velocidad, construyendo sitios sólidos y eficientes que impulsan el ",
            manifestoGrowth: "crecimiento real",
            manifestoEnd: " de tu negocio.",
            signatureName: "Carlos Beuvrin",
            signatureTitle: "AI Engineer · Fundador",
            avatarAlt:
                "Carlos Beuvrin - Director de Keting Media · Diseño y desarrollo de software, web y apps a medida en México",
        },
        textSection: {
            eyebrow: "Manifiesto",
            part1Pre: "Como ",
            expertsWord: "expertos",
            part1Mid: " en creación de sitios web,",
            part2: "Keting le ofrece servicios a medida para potenciar su presencia online.",
            part3Pre: "Combinamos ",
            creativityWord: "creatividad",
            part3Mid: ", pensamiento estratégico y ",
            technologyWord: "tecnología",
            part3End: " para crear soluciones personalizadas que contribuirán a su éxito.",
        },
        ecommerce: {
            tags: ["Catálogo curado", "Pagos en línea", "Inventario", "SEO técnico"],
            eyebrow: "Servicio · E-commerce",
            h2Pre: "Tiendas en línea que ",
            h2Accent: "venden",
            paragraphPre: "Desarrollamos ",
            paragraphStrong: "e-commerce a medida",
            paragraphEnd:
                " —catálogo, carrito, pagos en línea e inventario— con un diseño que convierte y una base rápida y escalable (Next.js / React). Sin comisiones por venta ni plantillas que te limiten. También migramos tiendas existentes a una base más sólida.",
            badge: "↑ 5x ventas",
            imageAlt: "Rosymar González · E-commerce de joyería a medida",
        },
        landing: {
            tags: ["Mensaje claro", "Carga veloz", "Orientada a conversión", "SEO técnico"],
            eyebrow: "Servicio · Landing pages",
            h2Pre: "Landing pages que ",
            h2Accent: "convierten",
            paragraphPre:
                "Una landing tiene un solo trabajo: convertir la visita en cliente. Diseñamos páginas con ",
            paragraphStrong: "mensaje claro",
            paragraphEnd:
                ", carga casi instantánea y una estructura persuasiva —probada y medible— para que tu inversión en anuncios y tráfico no se desperdicie.",
            badge: "100k+ sesiones/mes",
            imageAlt: "Iudex · Landing de alto impacto (Legal AI)",
        },
        zoom: {
            eyebrow: "Producto entregado",
            badge: "LIVE · v1.0",
            caption: "Web responsive · Producción 2026",
            altMobile: "Diseño web móvil — Keting",
            altDesktop: "Diseño web — Keting",
        },
        portfolio: {
            eyebrow: "Trabajo selecto",
            ctaPre: "Ver ",
            ctaAccent: "portafolio",
        },
        clients: {
            smallLabel: "Una década de colaboraciones selectas",
            eyebrow: "Clientes",
            h2Pre: "Marcas que ",
            h2Accent: "confían",
            h2End: " en nosotros",
            paragraphPre: "Cada ",
            paragraphAccent: "colaboración",
            paragraphEnd: ", una historia que escala.",
            prev: "Anterior",
            next: "Siguiente",
        },
        services: {
            eyebrow: "Lo que hacemos",
            colDesign: "Diseño",
            colDev: "Desarrollo",
            designServices: [
                {
                    title: "Diseño UX/UI",
                    description:
                        "Interfaces claras y funcionales, optimizadas para convertir y deleitar al usuario en cada interacción.",
                },
                {
                    title: "Diseño de movimiento",
                    description:
                        "Animaciones precisas que dan vida al producto y guían la atención sin distraer.",
                },
                {
                    title: "Sistema de diseño",
                    description:
                        "Componentes y reglas reutilizables para escalar el producto con consistencia y velocidad.",
                },
                {
                    title: "Estrategia de contenido",
                    description:
                        "Mensajes con jerarquía y propósito que conectan con su audiencia en cada touchpoint.",
                },
                {
                    title: "Pruebas de usabilidad",
                    description:
                        "Validamos decisiones con usuarios reales para reducir riesgos antes del lanzamiento.",
                },
            ],
            developmentServices: [
                {
                    title: "Desarrollo Front-end/back-end",
                    description:
                        "Stack moderno y arquitectura sólida para productos rápidos, estables y escalables.",
                },
                {
                    title: "E-Commerce personalizado",
                    description:
                        "Tiendas en línea diseñadas para vender: UX impecable, performance excepcional y conversión arriba.",
                },
                {
                    title: "Desarrollo web creativo",
                    description:
                        "Experiencias web con identidad: WebGL, scroll narrativo e interacciones que distinguen su marca.",
                },
                {
                    title: "Gamificación",
                    description:
                        "Mecánicas de juego que aumentan engagement, retención y lealtad sin sentirse forzadas.",
                },
                {
                    title: "SEO",
                    description:
                        "Optimización técnica y de contenido para que Google entienda su propuesta y la posicione arriba.",
                },
            ],
        },
        faqEyebrow: "FAQ",
        faqTitleLead: "Preguntas",
        faqTitleAccent: "frecuentes",
        faq: [
            {
                q: "¿Cuánto cuesta una página web a medida en México?",
                a: "En 2026, una landing a medida arranca desde $12,500 MXN y un sitio corporativo con gestor de contenido va de $25,000 a $70,000 MXN. El precio depende del alcance, las integraciones y el nivel de diseño e ingeniería.",
            },
            {
                q: "¿Cuánto tarda en desarrollarse?",
                a: "Una landing puede estar lista en 1 a 2 semanas y un sitio corporativo en 3 a 6 semanas, según el alcance y la rapidez con la que se aprueban contenidos.",
            },
            {
                q: "¿Hacen el diseño desde cero o usan plantillas?",
                a: "Trabajamos a medida, sin plantillas: diseñamos la experiencia (UX/UI) desde cero para que tu marca se diferencie y el sitio convierta mejor.",
            },
            {
                q: "¿El sitio incluye SEO?",
                a: "Sí. Cada proyecto incluye SEO técnico, estructura semántica y optimización de velocidad (Core Web Vitals) para que el sitio realmente atraiga clientes.",
            },
            {
                q: "¿Con qué tecnología desarrollan?",
                a: "Usamos tecnología moderna como Next.js y React, con renderizado en servidor para máxima velocidad, seguridad y posicionamiento.",
            },
            {
                q: "¿Desarrollan tiendas en línea (e-commerce)?",
                a: "Sí. Construimos e-commerce a medida —catálogo, carrito, pagos en línea e inventario— integrado con tu operación. También migramos tiendas existentes a una base más rápida y escalable.",
            },
            {
                q: "¿Puedo actualizar el contenido yo mismo?",
                a: "Sí. Entregamos el sitio con un gestor de contenido (CMS) para que edites textos, imágenes, blog y productos sin depender de un programador.",
            },
            {
                q: "¿El sitio funciona bien en celular?",
                a: "Siempre. Diseñamos mobile-first y optimizamos el rendimiento en móvil (Core Web Vitals), donde ocurre la mayoría del tráfico y las conversiones en México.",
            },
            {
                q: "¿Qué incluye después del lanzamiento?",
                a: "Ofrecemos mantenimiento, monitoreo de rendimiento, respaldos y mejoras continuas desde $2,500 MXN al mes, para que tu sitio siga rápido, seguro y actualizado.",
            },
            {
                q: "¿También desarrollan aplicaciones web a medida?",
                a: "Sí. Más allá de sitios, desarrollamos aplicaciones web y plataformas a medida —paneles, portales y SaaS— con la misma base de ingeniería: Next.js, React y APIs propias.",
            },
        ],
    },
    footer: {
        es: "Español",
        en: "English",
        email: "Email",
        rights: "Todos los derechos reservados.",
        privacy: "Aviso de Privacidad",
        terms: "Términos y Condiciones",
        kicker: "Estudio digital · CDMX, México",
        slogan1: "Diseño",
        sloganItalic: "que escala",
        slogan2: "negocios",
        slogan3: "ambiciosos.",
        servicesTitle: "Servicios",
        resourcesTitle: "Recursos",
        contactTitle: "Contacto",
        followTitle: "Síguenos",
        emailLabel: "Escríbenos",
        phoneLabel: "Llámanos",
        cityLabel: "Visítanos",
        cityValue: "Ciudad de México · MX",
        availability: "Disponibilidad",
        availabilityValue: "Lun — Vie · 9—18h CDT",
        backToTop: "Volver arriba",
    },
};

const en: typeof es = {
    nav: {
        home: "Home",
        webdesign: "Web Design",
        webdesignShort: "Design",
        digital: "Software Development",
        digitalShort: "Software",
        automation: "Automation",
        automationShort: "AI",
        price: "Pricing",
        portfolio: "Portfolio",
        blog: "Journal",
        contact: "Contact",
        menu: "Menu",
        letsTalk: "Let's Talk",
        idiom: "Language",
    },
    common: {
        live: "Live",
        scroll: "Scroll",
        loading: "Loading…",
        more: "Read more",
        manifesto: "Manifesto",
        clients: "Clients",
        testimonials: "Testimonials",
        whatWeDo: "What we do",
        selectedWork: "Selected work",
        cookies: "Cookies",
        and: "and",
    },
    cookie: {
        text: "We use cookies to improve your experience and analyze traffic.",
        moreInfo: "More information",
        accept: "Accept",
        reject: "Decline",
    },
    contact: {
        title: "Talk to the team",
        interestQuestion: "How can we help?",
        interests: {
            web: "Web Design",
            price: "Pricing",
            digital: "Digital Solution",
        },
        name: "Name*",
        namePh: "Your name",
        email: "Email*",
        emailPh: "Email address",
        phone: "Phone*",
        message: "Message",
        send: "Send Message",
        sending: "Sending…",
        sent: "Sent!",
        error: "Failed to send",
        workingIn: "Working from Mexico",
        contactDirectly: "Contact us directly",
        close: "Close",
    },
    hero: {
        eyebrow: "Digital design & development",
        title: "Custom software, web and apps that scale your ambition.",
        titleStyles: {
            playfair: ["software", "apps"],
            italic: ["scale"],
            underlined: ["ambition."],
        },
        stats: {
            prefix: "Over",
            stat: "80%",
            middle: "of our",
            projects: "projects",
            are: "come from",
            referred: "referrals",
            line2: "by past clients who know",
            line3: "our craft and commitment.",
        },
        cta: "Let's Talk",
    },
    services: {
        eyebrow: "01 · Service",
        title: "Web",
        titleItalic: "design",
        descIntro: "We build",
        descTags: ["e-commerce", "platforms", "landing pages"],
        descTail:
            ". We blend editorial design with technical SEO and performance to scale your business.",
    },
    automationHome: {
        eyebrow: "03 · Service",
        title: "Automation",
        titleItalic: "with AI",
        subtitle: "Processes that run themselves",
        description:
            "Your team loses hours to repetitive tasks. We automate your processes with workflows, AI agents and WhatsApp assistants connected to your systems — so operations run on their own and your people focus on what truly needs human judgment.",
        tags: ["Agents", "Workflows", "WhatsApp"],
    },
    digital: {
        eyebrow: "02 · Service",
        title: "Digital",
        titleItalic: "solutions",
        subtitle: "Hyper-personalized apps",
        description:
            "We transform global digital businesses with innovative solutions powered by artificial intelligence — optimizing UX, automating processes and maximizing outcomes with advanced technology.",
    },
    toogo: {
        eyebrow: "Case · Toogo",
    },
    about: {
        eyebrow: "About",
        title: "Crafting the future",
        titleItalic: "digital",
        subline1: "in",
        mexico: "Mexico",
        subline2: "since",
        year: "2019",
        subline3: ". Design and AI-driven innovation",
        ai: "AI",
        subline4: "for projects that break the mold.",
        quoteEyebrow: "Manifesto",
        quote:
            "I focus on working with brands that want to scale their business through innovative solutions and design that truly connects with their customers.",
        quoteAuthor: "— Carlos Beuvrin",
    },
    blog: {
        eyebrow: "Blog & Resources",
        title1: "Ideas that",
        title2: "inspire",
        hintLeft: "Drag",
        hintMid: "or",
        hintRight: "use the arrows",
    },
    brands: {
        eyebrow: "A few of ours",
        title1: "Built for",
        titleItalic: "brands",
        title2: "that reshape their industry.",
        stat1: "10+ brands",
        stat2: "8 industries",
    },
    webdesign: {
        manifestoEyebrow: "Manifesto",
        manifestoIntro: "As",
        aiEngineer: "AI Engineers",
        manifesto1:
            ", we design and engineer precise digital solutions — from online stores to course platforms. We specialize in",
        webDev: "web development",
        manifesto2:
            ", SEO and speed optimization, building solid, efficient sites that drive",
        realGrowth: "real growth",
        manifesto3: "for your business.",
        carlos: "Carlos Beuvrin",
        carlosRole: "Developer",
        textSection1: "As a",
        agencyDigital: "digital agency",
        textSection2:
            "specialized in crafting websites, Keting delivers tailor-made services to boost your online presence. We blend",
        creativity: "creativity",
        textSection3: ", strategic thinking and",
        technology: "technology",
        textSection4:
            "to create custom solutions that contribute to your success.",
        productEyebrow: "Delivered product",
        productCaption: "Responsive web · 2026 Production",
        portfolioCta: "View",
        portfolioCtaItalic: "portfolio",
        clientsTitle1: "Brands that",
        clientsItalic: "trust",
        clientsTitle2: "us",
        clientsSubtitle1: "Every",
        collaboration: "collaboration",
        clientsSubtitle2: ", a story that scales.",
        testimonialsTitle1: "And what",
        testimonialsItalic: "do they say",
        testimonialsTitle2: "about us?",
        testimonialsSubtitleResults: "Real results",
        testimonialsSubtitle1: "for real",
        testimonialsSubtitleBrands: "brands",
        testimonialsSubtitle2: ".",
        servicesTitleDesign: "Design",
        servicesTitleDev: "Engineering",
    },
    webPage: {
        hero: {
            h1: "Custom web design and development in Mexico",
            badge: "World Wide Web",
            drag: "drag them",
            cornerPre: "Web ",
            cornerItalic: "design",
            cornerSuffix: " · 2026",
            scroll: "Scroll",
            eyebrow: "Manifesto",
            manifestoPre: "As an ",
            manifestoRole: "AI Engineer",
            manifestoMid: ", I design and structure ",
            manifestoSolutions: "precise digital solutions",
            manifestoMid2:
                ", from online stores to course platforms. I specialize in ",
            manifestoSpecialty: "web development",
            manifestoMid3:
                ", SEO and speed optimization, building solid, efficient sites that drive ",
            manifestoGrowth: "real growth",
            manifestoEnd: " for your business.",
            signatureName: "Carlos Beuvrin",
            signatureTitle: "AI Engineer · Founder",
            avatarAlt:
                "Carlos Beuvrin - Director of Keting Media · Custom software, web and app design and development in Mexico",
        },
        textSection: {
            eyebrow: "Manifesto",
            part1Pre: "As ",
            expertsWord: "experts",
            part1Mid: " in building websites,",
            part2: "Keting offers tailor-made services to strengthen your online presence.",
            part3Pre: "We combine ",
            creativityWord: "creativity",
            part3Mid: ", strategic thinking and ",
            technologyWord: "technology",
            part3End: " to craft custom solutions that drive your success.",
        },
        ecommerce: {
            tags: ["Curated catalog", "Online payments", "Inventory", "Technical SEO"],
            eyebrow: "Service · E-commerce",
            h2Pre: "Online stores that ",
            h2Accent: "sell",
            paragraphPre: "We build ",
            paragraphStrong: "custom e-commerce",
            paragraphEnd:
                " — catalog, cart, online payments and inventory — with a design that converts and a fast, scalable foundation (Next.js / React). No per-sale fees, no templates holding you back. We also migrate existing stores to a stronger foundation.",
            badge: "↑ 5x sales",
            imageAlt: "Rosymar González · Custom jewelry e-commerce",
        },
        landing: {
            tags: ["Clear message", "Fast load", "Conversion-focused", "Technical SEO"],
            eyebrow: "Service · Landing pages",
            h2Pre: "Landing pages that ",
            h2Accent: "convert",
            paragraphPre:
                "A landing page has one job: turn the visitor into a customer. We design pages with ",
            paragraphStrong: "a clear message",
            paragraphEnd:
                ", near-instant load and a persuasive structure — proven and measurable — so your investment in ads and traffic doesn't go to waste.",
            badge: "100k+ sessions/mo",
            imageAlt: "Iudex · High-impact landing page (Legal AI)",
        },
        zoom: {
            eyebrow: "Delivered product",
            badge: "LIVE · v1.0",
            caption: "Responsive web · Shipped 2026",
            altMobile: "Mobile web design — Keting",
            altDesktop: "Web design — Keting",
        },
        portfolio: {
            eyebrow: "Selected work",
            ctaPre: "View ",
            ctaAccent: "portfolio",
        },
        clients: {
            smallLabel: "A decade of selected collaborations",
            eyebrow: "Clients",
            h2Pre: "Brands that ",
            h2Accent: "trust",
            h2End: " us",
            paragraphPre: "Every ",
            paragraphAccent: "collaboration",
            paragraphEnd: ", a story that scales.",
            prev: "Previous",
            next: "Next",
        },
        services: {
            eyebrow: "What we do",
            colDesign: "Design",
            colDev: "Development",
            designServices: [
                {
                    title: "UX/UI Design",
                    description:
                        "Clear, functional interfaces, optimized to convert and delight the user at every interaction.",
                },
                {
                    title: "Motion design",
                    description:
                        "Precise animations that bring the product to life and guide attention without distracting.",
                },
                {
                    title: "Design system",
                    description:
                        "Reusable components and rules to scale the product with consistency and speed.",
                },
                {
                    title: "Content strategy",
                    description:
                        "Messaging with hierarchy and purpose that connects with your audience at every touchpoint.",
                },
                {
                    title: "Usability testing",
                    description:
                        "We validate decisions with real users to reduce risk before launch.",
                },
            ],
            developmentServices: [
                {
                    title: "Front-end / back-end development",
                    description:
                        "Modern stack and solid architecture for fast, stable, scalable products.",
                },
                {
                    title: "Custom e-commerce",
                    description:
                        "Online stores designed to sell: flawless UX, exceptional performance and higher conversion.",
                },
                {
                    title: "Creative web development",
                    description:
                        "Web experiences with identity: WebGL, narrative scroll and interactions that set your brand apart.",
                },
                {
                    title: "Gamification",
                    description:
                        "Game mechanics that boost engagement, retention and loyalty without feeling forced.",
                },
                {
                    title: "SEO",
                    description:
                        "Technical and content optimization so Google understands your offering and ranks it higher.",
                },
            ],
        },
        faqEyebrow: "FAQ",
        faqTitleLead: "Frequently asked",
        faqTitleAccent: "questions",
        faq: [
            {
                q: "How much does a custom website cost in Mexico?",
                a: "In 2026, a custom landing page starts at around $700 USD and a corporate site with a content manager ranges from $1,400 to $4,000 USD. The price depends on scope, integrations and the level of design and engineering.",
            },
            {
                q: "How long does it take to build?",
                a: "A landing page can be ready in 1 to 2 weeks and a corporate site in 3 to 6 weeks, depending on scope and how quickly content is approved.",
            },
            {
                q: "Do you design from scratch or use templates?",
                a: "We work fully custom, no templates: we design the experience (UX/UI) from scratch so your brand stands out and the site converts better.",
            },
            {
                q: "Does the site include SEO?",
                a: "Yes. Every project includes technical SEO, semantic structure and speed optimization (Core Web Vitals) so the site truly attracts customers.",
            },
            {
                q: "What technology do you build with?",
                a: "We use modern technology like Next.js and React, with server-side rendering for maximum speed, security and ranking.",
            },
            {
                q: "Do you build online stores (e-commerce)?",
                a: "Yes. We build custom e-commerce — catalog, cart, online payments and inventory — integrated with your operation. We also migrate existing stores to a faster, more scalable foundation.",
            },
            {
                q: "Can I update the content myself?",
                a: "Yes. We deliver the site with a content management system (CMS) so you can edit text, images, blog and products without depending on a developer.",
            },
            {
                q: "Does the site work well on mobile?",
                a: "Always. We design mobile-first and optimize mobile performance (Core Web Vitals), where most traffic and conversions happen.",
            },
            {
                q: "What's included after launch?",
                a: "We offer maintenance, performance monitoring, backups and continuous improvements from around $140 USD per month, so your site stays fast, secure and up to date.",
            },
            {
                q: "Do you also build custom web applications?",
                a: "Yes. Beyond websites, we build custom web applications and platforms — dashboards, portals and SaaS — on the same engineering foundation: Next.js, React and custom APIs.",
            },
        ],
    },
    footer: {
        es: "Spanish",
        en: "English",
        email: "Email",
        rights: "All rights reserved.",
        privacy: "Privacy Policy",
        terms: "Terms & Conditions",
        kicker: "Digital studio · Mexico City",
        slogan1: "Design",
        sloganItalic: "that scales",
        slogan2: "ambitious",
        slogan3: "businesses.",
        servicesTitle: "Services",
        resourcesTitle: "Resources",
        contactTitle: "Contact",
        followTitle: "Follow us",
        emailLabel: "Write to us",
        phoneLabel: "Call us",
        cityLabel: "Visit us",
        cityValue: "Mexico City · MX",
        availability: "Hours",
        availabilityValue: "Mon — Fri · 9am—6pm CDT",
        backToTop: "Back to top",
    },
};

export const dictionaries = { es, en } as const;
export type Lang = keyof typeof dictionaries;
export type Dictionary = typeof es;
