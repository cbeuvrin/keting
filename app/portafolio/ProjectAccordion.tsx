"use client";

import { Children, createContext, useContext, useId, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/lib/i18n/lang-context";
import { caseStudyHref } from "@/lib/i18n/routes";
import styles from "./ProjectAccordion.module.css";

const AccordionContext = createContext<{
    open: string | null;
    setOpen: (slug: string | null) => void;
}>({ open: null, setOpen: () => {} });

export function ProjectAccordion({ children }: { children: ReactNode }) {
    const [open, setOpen] = useState<string | null>(null);
    const { lang } = useLang();
    const isEn = lang === "en";

    return (
        <AccordionContext.Provider value={{ open, setOpen }}>
            <section id="proyectos" aria-labelledby="projects-heading" className={styles.section}>
                <div className={styles.container}>
                    <div className={styles.heading}>
                        <h2 id="projects-heading">{isEn ? "Selected projects" : "Proyectos seleccionados"} <span>({String(Children.count(children)).padStart(2, "0")})</span></h2>
                        <p>{isEn ? "Explore a project. Open its story." : "Explora un proyecto. Abre su historia."}</p>
                    </div>
                    <div className={styles.list}>{children}</div>
                </div>
            </section>
        </AccordionContext.Provider>
    );
}

type ProjectProps = {
    projectName: string;
    eyebrow: string;
    titleTop: string;
    titleAccent: string;
    titleBottom?: string;
    body: ReactNode;
    tags: string[];
    palette?: string[];
    font?: string;
    fontStyle?: "serif" | "sans" | "display";
    metric?: { value: string; label: string };
    url?: string;
    image: string;
    imageSize?: { width: number; height: number };
    imageAlt: string;
    imageCaption?: string;
    bareImage?: boolean;
    caseSlug: string;
};

export function PortfolioProject({ projectName, eyebrow, titleTop, titleAccent, titleBottom, body, tags, palette, font, metric, url, image, imageSize, imageAlt, imageCaption, bareImage, caseSlug }: ProjectProps) {
    const { open, setOpen } = useContext(AccordionContext);
    const { t, lang } = useLang();
    const [previewDismissed, setPreviewDismissed] = useState(false);
    const id = useId();
    const expanded = open === caseSlug;
    const card = t.portfolioPage.card;
    const caseHref = caseStudyHref(caseSlug, lang === "en");
    const category = eyebrow.split(" · ").slice(1).join(" · ") || eyebrow;
    const imageStyle = imageSize ? { aspectRatio: `${imageSize.width} / ${imageSize.height}` } : undefined;

    return (
        <article className={styles.project} data-open={expanded}>
            <h3 className={styles.rowHeading}>
                <button
                    type="button"
                    id={`${id}-trigger`}
                    aria-expanded={expanded}
                    aria-controls={`${id}-panel`}
                    className={styles.trigger}
                    data-preview-dismissed={previewDismissed}
                    onClick={(event) => {
                        // Keep the chosen row in view when a taller preceding panel closes.
                        const previousTop = event.currentTarget.getBoundingClientRect().top;
                        const trigger = event.currentTarget;
                        setOpen(expanded ? null : caseSlug);
                        setPreviewDismissed(true);
                        requestAnimationFrame(() => {
                            const difference = trigger.getBoundingClientRect().top - previousTop;
                            if (Math.abs(difference) > 1) window.scrollBy({ top: difference, behavior: "instant" });
                        });
                    }}
                    onPointerLeave={() => setPreviewDismissed(false)}
                    onBlur={() => setPreviewDismissed(false)}
                    onKeyDown={(event) => {
                        if (event.key === "Escape") setPreviewDismissed(true);
                    }}
                >
                    <span aria-hidden="true" className={styles.index} />
                    <span className={styles.name}>{projectName}</span>
                    <span className={styles.category}>{category}</span>
                    <span aria-hidden="true" className={styles.toggle}><span /><span /></span>
                    <span aria-hidden="true" className={styles.preview} style={imageStyle}>
                        <Image src={image} alt="" fill sizes="360px" className={bareImage ? styles.contain : styles.cover} />
                    </span>
                </button>
            </h3>
            <div id={`${id}-panel`} aria-labelledby={`${id}-trigger`} role="region" hidden={!expanded} className={styles.panel}>
                <div className={styles.details}>
                    <div className={styles.copy}>
                        <p className={styles.projectTitle}>{titleTop} <em>{titleAccent}</em>{titleBottom && <> {titleBottom}</>}</p>
                        <p className={styles.body}>{body}</p>
                        <ul className={styles.tags} aria-label={lang === "en" ? "Project details" : "Detalles del proyecto"}>
                            {tags.map(tag => <li key={tag}>{tag}</li>)}
                        </ul>
                        {(Boolean(palette?.length) || font) && <dl className={styles.specs}>
                            {palette && palette.length > 0 && <div>
                                <dt>{card.palette}</dt>
                                <dd className={styles.swatches}>{palette.map((color, i) => <span key={`${color}-${i}`} style={{ backgroundColor: color }} title={color} aria-label={color} />)}</dd>
                            </div>}
                            {font && <div><dt>{card.typography}</dt><dd>{font}</dd></div>}
                        </dl>}
                        {metric && <p className={styles.metric}><strong>{metric.value}</strong><span>{metric.label}</span></p>}
                        <div className={styles.links}>
                            <Link href={caseHref}>{card.readCase}<span aria-hidden="true">↗</span></Link>
                            {url && <a href={url} target="_blank" rel="noopener noreferrer">{card.viewLive}<span aria-hidden="true">↗</span></a>}
                        </div>
                    </div>
                    <a
                        href={url || caseHref}
                        {...(url ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        aria-label={`${url ? card.viewLive : card.readCase} — ${projectName}`}
                        className={styles.imageLink}
                        data-natural={Boolean(imageSize)}
                    >
                        <div className={styles.imageFrame} style={imageStyle}>
                            <Image src={image} alt={imageAlt} fill sizes="(max-width: 767px) 90vw, 55vw" className={bareImage ? styles.contain : styles.cover} />
                        </div>
                        <span className={styles.imageCaption}><span>{imageCaption || (url ? new URL(url).hostname.replace(/^www\./, "") : card.fallbackUrl)}</span><span aria-hidden="true">↗</span></span>
                    </a>
                </div>
            </div>
        </article>
    );
}
