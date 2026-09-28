import { MONSTERS } from "./monsters";
import { v } from "./palette";

/**
 * Dónde va cada pieza en el póster. `x`,`y` son la esquina superior izquierda
 * de la pieza YA escalada, en unidades del viewBox de la escena; `s` es la
 * escala sobre su tamaño nativo (w×h). El orden del arreglo es el orden de
 * pintado: lo último queda al frente.
 */
export type Placement = {
    id: string;
    x: number;
    y: number;
    s: number;
    /** Espejo horizontal (la escena corrige también la mirada de las pupilas). */
    flip?: boolean;
    /** Retraso de parpadeo/flotación, para que no se muevan todos a la vez. */
    bd?: string;
};

export type Layout = { width: number; height: number; placements: Placement[] };

export function Scene({ layout, className }: { layout: Layout; className?: string }) {
    return (
        <svg
            className={`hw-scene ${className ?? ""}`}
            viewBox={`0 0 ${layout.width} ${layout.height}`}
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
        >
            {layout.placements.map((p, i) => {
                const def = MONSTERS[p.id];
                if (!def) return null;
                const tx = p.flip ? p.x + def.w * p.s : p.x;
                return (
                    <g key={`${p.id}-${i}`} transform={`translate(${tx} ${p.y}) scale(${p.flip ? -p.s : p.s} ${p.s})`}>
                        <g
                            className={def.interactive ? "hw-monster" : "hw-monster hw-deco"}
                            data-flip={p.flip ? "1" : undefined}
                            style={p.bd ? v({ "--bd": p.bd }) : undefined}
                        >
                            <def.Art />
                        </g>
                    </g>
                );
            })}
        </svg>
    );
}
