// Paleta del póster de Halloween. Apagada a propósito: tonos de papel impreso
// (rosa polvo, lila, verde azulado, hueso) sobre casi-negro, con una línea de
// tinta gruesa. Los naranjas de calabaza también van apagados para que no
// griten más que el resto.

import type { CSSProperties } from "react";

export const INK = "#1c1a1e";
export const BG = "#141216";

/** Grosor de la línea de tinta, en unidades del viewBox de cada monstruo. */
export const LINE = 4;

/** Props de trazo de tinta para esparcir en cualquier forma: {...inked}. */
export const inked = {
    stroke: INK,
    strokeWidth: LINE,
    strokeLinejoin: "round",
    strokeLinecap: "round",
} as const;

/** Variables CSS en `style` sin pelearse con el tipo de React: v({ "--o": "50% 100%" }). */
export const v = (vars: Record<`--${string}`, string>) => vars as CSSProperties;

export const P = {
    bone: "#ece3cf",
    boneShade: "#d3c8ae",
    cream: "#f3ecd9",

    rose: "#cf6f7e",
    roseDeep: "#a24d5e",
    roseLight: "#e59aa6",

    lilac: "#8e7cb3",
    lilacLight: "#b3a3cf",
    lilacDeep: "#65588c",

    teal: "#4f8c80",
    tealLight: "#7fb3a4",
    tealDeep: "#2f5c53",

    sage: "#76a07a",
    moss: "#3f6b4f",

    navy: "#3e4d97",
    navyLight: "#5c6fbf",
    navyDeep: "#2b3168",

    mustard: "#d8b36a",
    mustardDeep: "#b28c45",

    pumpkin: "#d98a4f",
    pumpkinDeep: "#b0643a",

    sky: "#8ec3d3",
    burlap: "#d9c49a",
    burlapShade: "#bda676",
    plum: "#5a3e5e",
    charcoal: "#2a262c",

    eyeWhite: "#f4eedd",
    irisTeal: "#5fa6a0",
    irisPink: "#d9738a",
    irisGold: "#e0b85a",
    tongue: "#e07d8c",
    mouth: "#3a1f2a",
} as const;
