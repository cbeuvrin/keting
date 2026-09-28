import type { Layout } from "./scene";

/*
 * Composición final del póster: el "Tapiz" (variante c), denso de borde a borde.
 *
 * Reglas que la sostienen:
 * - Lo que está antes en la lista se pinta atrás. Los grandes van atrás con la
 *   cara arriba; cada fila tapa los cuerpos de la anterior, no sus caras.
 * - Detrás del logo con su info y detrás de los botones hay un difuminado negro
 *   (halloween-poster.tsx): ahí solo va relleno (hojas, flores, estrellas).
 * - Colores repartidos: ningún par de grandes del mismo tono lado a lado; los
 *   naranjas y los claros salpicados por todo el póster.
 */

// ESCRITORIO — viewBox 1600×1000 con "slice". Siempre visible: x 175–1425, y 50–950.
// Título: x 710–1570, y 40–270. Logo e info: x 30–520, y 40–330. Botones: x 560–1500, y 800–960.
export const DESKTOP: Layout = {
  width: 1600,
  height: 1000,
  placements: [
    // FONDO: estrellas solo en los huecos (nunca sobre las letras) y follaje grande en los costados
    { id: "estrellas", x: 470, y: -30, s: 0.75, flip: true },
    { id: "estrellas", x: 1040, y: 215, s: 0.45 },
    { id: "helecho", x: -30, y: 330, s: 1.5 },
    { id: "helecho", x: 95, y: 340, s: 1.2, flip: true },
    { id: "helecho", x: 1490, y: 260, s: 1.5, flip: true },
    { id: "helecho", x: 1405, y: 240, s: 1.2 },
    { id: "hojas-anchas", x: -70, y: 440, s: 1.6 },
    { id: "hojas-anchas", x: 1320, y: 400, s: 1.6, flip: true },
    { id: "hojas-anchas", x: -60, y: 650, s: 1.5, flip: true },
    { id: "hojas-anchas", x: 1350, y: 610, s: 1.5 },
    // cempasúchil en las orillas, para que los costados no sean solo verdes
    { id: "cempasuchil", x: 20, y: 560, s: 0.9 },
    { id: "cempasuchil", x: 1420, y: 530, s: 0.9, flip: true },
    { id: "ramita", x: 470, y: 330, s: 1.3 },
    { id: "ramita", x: 1150, y: 320, s: 1.3, flip: true },
    // FILA DE ATRÁS: caras a y≈320–440. El gato baja para no rozar la info en 1366×768
    { id: "gato-negro", x: 100, y: 280, s: 0.9, bd: "5.8s" },
    { id: "monstruo-laguna", x: 420, y: 242, s: 0.85, bd: "2.4s" },
    { id: "dracula", x: 540, y: 180, s: 1.15, bd: "1.9s" },
    { id: "frankenstein", x: 790, y: 187, s: 1.02, bd: "0.9s" },
    { id: "catrina", x: 975, y: 192, s: 1.02, bd: "5.4s" },
    { id: "hombre-lobo", x: 1110, y: 232, s: 0.98, bd: "5.0s" },
    { id: "vela-derretida", x: 1300, y: 243, s: 0.92, bd: "1.5s" },
    // relleno entre filas
    { id: "hojas-anchas", x: 340, y: 560, s: 1.4 },
    { id: "hojas-anchas", x: 850, y: 560, s: 1.4, flip: true },
    { id: "helecho", x: 1180, y: 470, s: 1.2 },
    { id: "hojas-anchas", x: 560, y: 630, s: 1.2 },
    { id: "hojas-anchas", x: 250, y: 670, s: 1.1, flip: true },
    { id: "cempasuchil", x: 1180, y: 650, s: 0.8 },
    // FILA MEDIA: la calabaza al centro como punto naranja; el pulpo a la izquierda, entre claros
    { id: "pulpo-lila", x: 270, y: 410, s: 1.0, bd: "4.1s" },
    { id: "esqueleto", x: 140, y: 405, s: 0.98, bd: "2.6s" },
    { id: "fantasma-sabana", x: 480, y: 407, s: 1.0, bd: "2.2s" },
    { id: "novia-frankenstein", x: 700, y: 364, s: 0.95, bd: "5.2s" },
    { id: "calabaza-gigante", x: 855, y: 395, s: 1.0, bd: "4.3s" },
    { id: "caldero-burbujas", x: 1095, y: 425, s: 0.95, bd: "6.3s" },
    { id: "momia", x: 1280, y: 440, s: 0.98, bd: "2.8s" },
    // el búho posado en la cabeza de la momia
    { id: "buho", x: 1335, y: 374, s: 0.62, bd: "3.3s" },
    // FRENTE: caras a y≈640–720
    { id: "zombi", x: 175, y: 586, s: 0.93, bd: "0.0s" },
    { id: "calavera-dulce", x: 350, y: 612, s: 0.8, bd: "4.5s" },
    { id: "slime-teal", x: 515, y: 610, s: 1.0, bd: "5.6s" },
    { id: "bruja-bolita", x: 835, y: 585, s: 0.88, bd: "6.5s" },
    { id: "dragoncito", x: 1010, y: 610, s: 0.92, bd: "3.9s" },
    { id: "cuervo-sombrero", x: 1165, y: 625, s: 0.82, bd: "0.2s" },
    { id: "arana-peluda", x: 1275, y: 640, s: 0.8, bd: "0.4s" },
    // SUELO: detrás de los botones solo relleno
    { id: "hojas-anchas", x: 520, y: 800, s: 1.3 },
    { id: "cempasuchil", x: 640, y: 810, s: 1.1 },
    { id: "lapida", x: 800, y: 810, s: 1.1 },
    { id: "hojas-anchas", x: 880, y: 830, s: 1.3, flip: true },
    { id: "cempasuchil", x: 1070, y: 820, s: 1.2, flip: true },
    { id: "lapida", x: 1230, y: 800, s: 1.1, flip: true },
    { id: "hojas-anchas", x: 1300, y: 820, s: 1.4 },
    { id: "calabacitas", x: 1440, y: 860, s: 1.2, flip: true },
    { id: "calabacitas", x: 720, y: 900, s: 1.1 },
    { id: "calabacitas", x: 1130, y: 910, s: 1.0, flip: true },
    // PRIMER PLANO: los chiquitos. Sobre los botones sus caras quedan arriba de y≈790 (en 1366×768 los botones suben a 800)
    { id: "fantasmitas", x: 545, y: 672, s: 0.85, bd: "4.4s" },
    { id: "hombre-invisible", x: 690, y: 590, s: 0.95, bd: "1.3s" },
    { id: "sapo-corona", x: 940, y: 705, s: 0.8, bd: "3.0s" },
    { id: "hongo-venenoso", x: 1060, y: 680, s: 0.78, bd: "6.1s" },
    { id: "dulce-maiz", x: 1150, y: 722, s: 0.75, bd: "1.1s" },
    // abajo a la izquierda (fuera de los botones): caras a y≈740–800, arriba del velo inferior
    { id: "mano-zombi", x: 120, y: 700, s: 0.88, bd: "2.0s" },
    { id: "chupacabras", x: 228, y: 712, s: 0.8, bd: "3.5s" },
    { id: "gusano-manzana", x: 395, y: 768, s: 0.85, bd: "5.9s" },
    { id: "rata", x: 478, y: 748, s: 0.78, bd: "4.8s" },
    { id: "pasto", x: -20, y: 925, s: 1.1 },
    { id: "pasto", x: 190, y: 930, s: 1.0, flip: true },
    { id: "pasto", x: 380, y: 925, s: 1.1 },
    { id: "pasto", x: 580, y: 930, s: 1.1, flip: true },
    { id: "pasto", x: 1400, y: 925, s: 1.1, flip: true },
    { id: "cempasuchil", x: 30, y: 850, s: 1.0 },
    { id: "cempasuchil", x: 400, y: 850, s: 0.8, flip: true },
    // VOLADORES: en el hueco entre la info y el título, y en la franja bajo «Monstruos», sin tapar letras
    { id: "bruja-escoba", x: 478, y: 40, s: 0.65, flip: true, bd: "0.7s" },
    { id: "arana-hilo", x: 632, y: 0, s: 1.4, bd: "0.6s" },
    { id: "murcielago", x: 812, y: 176, s: 0.7, bd: "4.6s" },
    { id: "ojo-alado", x: 1128, y: 189, s: 0.7, bd: "1.7s" },
  ],
};

// MÓVIL — viewBox 900×1600. Teléfonos ven x≈80–820; la tablet vertical ve x 0–900, y 200–1400.
// Franja libre en teléfono: y 330–1030. En tablet la info baja hasta y≈500 a la izquierda (x<330).
export const MOBILE: Layout = {
  width: 900,
  height: 1600,
  placements: [
    // FONDO: estrellas junto a «Monstruos» y follaje bajo en los costados (nada alto detrás de la info)
    { id: "estrellas", x: 640, y: 10, s: 0.55 },
    { id: "helecho", x: -20, y: 500, s: 1.2 },
    { id: "helecho", x: 740, y: 360, s: 1.35, flip: true },
    { id: "hojas-anchas", x: -10, y: 580, s: 1.4 },
    { id: "hojas-anchas", x: 640, y: 580, s: 1.4, flip: true },
    { id: "hojas-anchas", x: 0, y: 830, s: 1.4, flip: true },
    { id: "hojas-anchas", x: 620, y: 830, s: 1.4 },
    { id: "ramita", x: 610, y: 340, s: 1.1 },
    { id: "hojas-anchas", x: 230, y: 510, s: 1.1 },
    { id: "hojas-anchas", x: 560, y: 540, s: 1.0, flip: true },
    // FILA DE ATRÁS: el gato abajo de la info (orejas a y≈540); Drácula al centro, el más alto; Frankenstein a la derecha
    { id: "gato-negro", x: 35, y: 485, s: 0.9, bd: "3.7s" },
    { id: "dracula", x: 300, y: 318, s: 1.05, bd: "1.7s" },
    { id: "frankenstein", x: 560, y: 372, s: 0.92, bd: "4.6s" },
    // FILA MEDIA: caras a y≈660–740
    { id: "calabaza-gigante", x: 238, y: 598, s: 0.95, bd: "0.6s" },
    { id: "esqueleto", x: 66, y: 650, s: 0.88, bd: "0.7s" },
    { id: "catrina", x: 458, y: 535, s: 0.95, bd: "4.8s" },
    { id: "momia", x: 650, y: 600, s: 0.82, bd: "3.2s" },
    // FRENTE: caras a y≈830–880
    { id: "novia-frankenstein", x: 145, y: 705, s: 0.9, bd: "5.9s" },
    { id: "hombre-lobo", x: 318, y: 752, s: 0.95, bd: "2.0s" },
    { id: "fantasma-sabana", x: 575, y: 760, s: 0.9, bd: "3.3s" },
    // SUELO: tapa bases y llena detrás y debajo de los botones (solo relleno)
    { id: "cempasuchil", x: 40, y: 1010, s: 1.2 },
    { id: "calabacitas", x: 280, y: 1040, s: 1.3 },
    { id: "lapida", x: 500, y: 1010, s: 1.2 },
    { id: "cempasuchil", x: 640, y: 1030, s: 1.2, flip: true },
    { id: "hojas-anchas", x: 60, y: 1160, s: 1.5 },
    { id: "hojas-anchas", x: 520, y: 1160, s: 1.5, flip: true },
    { id: "helecho", x: 380, y: 1150, s: 1.2 },
    { id: "calabacitas", x: 120, y: 1330, s: 1.2, flip: true },
    { id: "cempasuchil", x: 560, y: 1300, s: 1.2 },
    { id: "pasto", x: 0, y: 1470, s: 1.5 },
    { id: "pasto", x: 300, y: 1480, s: 1.5, flip: true },
    { id: "pasto", x: 600, y: 1470, s: 1.5 },
    // PRIMER PLANO: los chiquitos, caras a y≈965–990 (los botones empiezan en ≈1030)
    { id: "chupacabras", x: 98, y: 932, s: 0.7, bd: "0.2s" },
    { id: "hongo-venenoso", x: 253, y: 901, s: 0.8, bd: "3.0s" },
    { id: "dulce-maiz", x: 379, y: 917, s: 0.8, bd: "1.1s" },
    { id: "slime-teal", x: 468, y: 919, s: 0.8, bd: "6.1s" },
    { id: "pulpo-lila", x: 599, y: 918, s: 0.65, bd: "0.4s" },
    { id: "sapo-corona", x: 690, y: 966, s: 0.62, bd: "2.4s" },
    // DEBAJO DE LOS BOTONES (solo teléfonos): solo relleno cálido que asoma del pasto. Ahí no van
    // personajes: el velo inferior los apaga y el padding del <footer> se come los toques.
    { id: "calabacitas", x: 130, y: 1418, s: 1.0 },
    { id: "cempasuchil", x: 320, y: 1400, s: 0.8, flip: true },
    { id: "calabacitas", x: 500, y: 1425, s: 0.85, flip: true },
    // VOLADORES: la bruja junto a Drácula (en tablet la info ocupa la izquierda hasta y≈500), con la araña colgando de su escoba
    { id: "murcielago", x: 348, y: 350, s: 0.5, bd: "3.9s" },
    { id: "ojo-alado", x: 455, y: 330, s: 0.5, bd: "1.3s" },
    { id: "bruja-escoba", x: 545, y: 335, s: 0.55, bd: "6.5s" },
    { id: "arana-hilo", x: 540, y: 432, s: 0.5, bd: "2.9s" },
  ],
};
