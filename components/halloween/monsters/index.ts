// Generado: una línea por pieza de esta carpeta. Al añadir un monstruo nuevo, impórtalo aquí.
import type { MonsterDef } from "../types";
import aranaHilo from "./arana-hilo";
import aranaPeluda from "./arana-peluda";
import brujaBolita from "./bruja-bolita";
import brujaEscoba from "./bruja-escoba";
import buho from "./buho";
import calabacitas from "./calabacitas";
import calabazaGigante from "./calabaza-gigante";
import calaveraDulce from "./calavera-dulce";
import calderoBurbujas from "./caldero-burbujas";
import catrina from "./catrina";
import cempasuchil from "./cempasuchil";
import chupacabras from "./chupacabras";
import cuervoSombrero from "./cuervo-sombrero";
import dracula from "./dracula";
import dragoncito from "./dragoncito";
import dulceMaiz from "./dulce-maiz";
import esqueleto from "./esqueleto";
import estrellas from "./estrellas";
import fantasmaSabana from "./fantasma-sabana";
import fantasmitas from "./fantasmitas";
import frankenstein from "./frankenstein";
import gatoNegro from "./gato-negro";
import gusanoManzana from "./gusano-manzana";
import helecho from "./helecho";
import hojasAnchas from "./hojas-anchas";
import hombreInvisible from "./hombre-invisible";
import hombreLobo from "./hombre-lobo";
import hongoVenenoso from "./hongo-venenoso";
import lapida from "./lapida";
import manoZombi from "./mano-zombi";
import momia from "./momia";
import monstruoLaguna from "./monstruo-laguna";
import murcielago from "./murcielago";
import noviaFrankenstein from "./novia-frankenstein";
import ojoAlado from "./ojo-alado";
import pasto from "./pasto";
import pulpoLila from "./pulpo-lila";
import ramita from "./ramita";
import rata from "./rata";
import sapoCorona from "./sapo-corona";
import slimeTeal from "./slime-teal";
import velaDerretida from "./vela-derretida";
import zombi from "./zombi";

const ALL: MonsterDef[] = [
    aranaHilo,
    aranaPeluda,
    brujaBolita,
    brujaEscoba,
    buho,
    calabacitas,
    calabazaGigante,
    calaveraDulce,
    calderoBurbujas,
    catrina,
    cempasuchil,
    chupacabras,
    cuervoSombrero,
    dracula,
    dragoncito,
    dulceMaiz,
    esqueleto,
    estrellas,
    fantasmaSabana,
    fantasmitas,
    frankenstein,
    gatoNegro,
    gusanoManzana,
    helecho,
    hojasAnchas,
    hombreInvisible,
    hombreLobo,
    hongoVenenoso,
    lapida,
    manoZombi,
    momia,
    monstruoLaguna,
    murcielago,
    noviaFrankenstein,
    ojoAlado,
    pasto,
    pulpoLila,
    ramita,
    rata,
    sapoCorona,
    slimeTeal,
    velaDerretida,
    zombi,
];

export const MONSTERS: Record<string, MonsterDef> = Object.fromEntries(ALL.map((m) => [m.id, m]));
