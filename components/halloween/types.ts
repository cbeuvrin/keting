import type { ReactElement } from "react";

/**
 * Un personaje (o pieza de relleno) del póster de Halloween.
 *
 * `Art` devuelve los hijos de un <g>, dibujados en coordenadas locales
 * 0..w × 0..h. La escena lo coloca, lo escala y lo envuelve en
 * `<g class="hw-monster">`, que es lo que activa las reacciones de
 * halloween.css al pasar el mouse (o al tocarlo en móvil, vía `.is-active`).
 */
export type MonsterDef = {
    id: string;
    /** Nombre corto en español, para la página de pruebas. */
    name: string;
    w: number;
    h: number;
    /** false para relleno (plantas, estrellas): no reacciona ni recibe hover. */
    interactive: boolean;
    Art: () => ReactElement;
};
