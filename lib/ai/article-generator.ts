import { GoogleGenAI } from "@google/genai";

/**
 * Generador de Artículos "Brain" de Keting Media
 * Utiliza Gemini 2.5 Flash — Artículo completo en una sola llamada
 */
export class ArticleGenerator {
    private client: GoogleGenAI;
    private modelName = "gemini-2.5-flash";

    constructor(apiKey: string) {
        this.client = new GoogleGenAI({ apiKey });
    }

    private async generate(prompt: string): Promise<string> {
        const response = await this.client.models.generateContent({
            model: this.modelName,
            contents: prompt,
            config: {
                maxOutputTokens: 8192,
                temperature: 0.8,
            },
        });
        return response.text ?? "";
    }

    /**
     * Genera una lista de temas tendencia
     */
    async generateTrends(): Promise<string[]> {
        const prompt = `Eres un estratega editorial de alto nivel de Keting Media.
        Genera una lista de 5 temas tendencia en tecnología corporativa premium, diseño UX y transformación digital.
        Responde SOLO con JSON puro: ["tema 1", "tema 2", "tema 3", "tema 4", "tema 5"]`;

        const text = (await this.generate(prompt)).replace(/```json|```/g, "").trim();
        return JSON.parse(text);
    }

    /**
     * Genera un artículo completo de 2500+ palabras en UNA SOLA llamada a la IA
     */
    async generateFullArticle(topic: string) {
        console.log(`[ArticleGenerator] Generando artículo: "${topic}"`);

        const prompt = `Eres el editor jefe de Keting Media, la agencia de diseño y tecnología más premium de Latinoamérica.

Escribe un artículo de blog COMPLETO, ultra-extenso y de nivel experto sobre el tema: "${topic}"

ESTRUCTURA OBLIGATORIA (HTML semántico puro, sin markdown):
- Una etiqueta <h1> con el título del artículo (creativo, no literal al tema)
- Al menos 8 secciones con <h2> como títulos
- Cada sección debe tener mínimo 3 párrafos <p> bien desarrollados
- Usa <strong>, <ul>, <li> para enriquecer el contenido
- Total mínimo: 2500 palabras

REGLAS DE ESTILO:
1. Tono sofisticado, culto, directo y altamente persuasivo
2. Análisis de mercado realistas con datos y tendencias actuales
3. Conceptos técnicos avanzados explicados con claridad
4. NO menciones que eres IA. Escribe como editorial humana de élite
5. En español, pensado para directivos y emprendedores premium de México y LATAM
6. El artículo debe sentirse como publicado en Harvard Business Review en español

IMPORTANTE: Devuelve ÚNICAMENTE el HTML del artículo. Ningún texto adicional antes ni después.`;

        let html = await this.generate(prompt);

        // Limpiar markdown si viene
        html = html.replace(/```html|```/g, "").trim();

        // Extraer el título del H1 para usarlo como title
        const h1Match = html.match(/<h1[^>]*>(.*?)<\/h1>/i);
        const extractedTitle = h1Match
            ? h1Match[1].replace(/<[^>]*>/g, "").trim()
            : topic;

        const wordCount = html.split(/\s+/).length;
        console.log(`[ArticleGenerator] Completado. ~${wordCount} palabras.`);

        return {
            title: extractedTitle,
            content: html,
            wordCount,
            slug: this.slugify(topic),
            date: new Date().toLocaleDateString('es-ES', { month: 'short', year: 'numeric' }),
            author: "Editorial Keting",
            category: "Estrategia Digital"
        };
    }

    private slugify(text: string) {
        return text.toString().toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, '')
            .replace(/--+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '');
    }
}
