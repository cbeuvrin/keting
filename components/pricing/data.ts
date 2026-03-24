
export interface PricingOption {
    label: string; // The "Scale / Volume"
    price2D: string;
    price3D: string;
}

export interface PricingProduct {
    id: string;
    category: string;
    type: string;
    description?: string; // Optional description
    image: string; // New image property
    startingPrice: string; // Lowest price for "Desde"
    options: PricingOption[];
}

export const pricingData: PricingProduct[] = [
    {
        id: "landings",
        category: "Landings",
        type: "Landing Page",
        image: "/images/pricing/landing.png",
        startingPrice: "$7,400 MXN",
        options: [
            {
                label: "Sencilla / 1 Sección",
                price2D: "$7,400 MXN",
                price3D: "$12,950 MXN"
            }
        ]
    },
    {
        id: "web-informativa",
        category: "Web Informativa",
        type: "Corporativa",
        image: "/images/pricing/webinfomativa.png",
        startingPrice: "$14,800 MXN",
        options: [
            {
                label: "5 Pestañas",
                price2D: "$14,800 MXN",
                price3D: "$29,873 MXN"
            },
            {
                label: "10 Pestañas",
                price2D: "$19,240 MXN",
                price3D: "$38,834 MXN"
            },
            {
                label: "+10 Pestañas",
                price2D: "$25,974+ MXN",
                price3D: "$52,427+ MXN"
            }
        ]
    },
    {
        id: "e-commerce",
        category: "E-Commerce",
        type: "Tienda Virtual",
        image: "/images/pricing/ecommerce.png",
        startingPrice: "$21,715 MXN",
        options: [
            {
                label: "Hasta 20 productos",
                price2D: "$21,715 MXN",
                price3D: "$49,382 MXN"
            },
            {
                label: "Hasta 50 productos",
                price2D: "$28,230 MXN",
                price3D: "$64,197 MXN"
            },
            {
                label: "Hasta 100 productos",
                price2D: "$36,699 MXN",
                price3D: "$83,456 MXN"
            },
            {
                label: "Hasta 1,000 productos",
                price2D: "$47,709 MXN",
                price3D: "$108,493 MXN"
            },
            {
                label: "Hasta 10,000 productos",
                price2D: "$62,022+ MXN",
                price3D: "$141,041+ MXN"
            }
        ]
    },
    {
        id: "e-learning",
        category: "E-Learning",
        type: "Plataforma de Cursos",
        image: "/images/pricing/elearning.png",
        startingPrice: "$32,839 MXN",
        options: [
            {
                label: "Básica (hasta 10 cursos)",
                price2D: "$32,839 MXN",
                price3D: "$49,893 MXN"
            },
            {
                label: "Avanzada (+10 cursos)",
                price2D: "$42,691+ MXN",
                price3D: "$64,861+ MXN"
            }
        ]
    }
];
