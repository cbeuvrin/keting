import { EventsPage } from "@/app/software-para-eventos/EventsPage";

// Gemela inglesa. El componente es el mismo: detecta el idioma por la ruta
// (usePathname) y lee del diccionario, igual que el resto de páginas espejo.
export default function Page() {
    return <EventsPage />;
}
