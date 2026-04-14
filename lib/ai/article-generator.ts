import { GoogleGenAI } from "@google/genai";
import { categories } from "./topics";

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

TEMAS Y CATEGORÍAS:
Elige la categoría más adecuada para este artículo de esta lista obligatoria: [${categories.join(", ")}].
Puedes elegir hasta 2 categorías separadas por coma si el tema lo amerita (ej: "IA, Marketing").

ESTRUCTURA OBLIGATORIA (HTML semántico puro, sin markdown en el contenido):
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
6. El artículo debe siente como publicado en Harvard Business Review en español

IMPORTANTE: Devuelve ÚNICAMENTE un objeto JSON puro (sin bloques de código markdown) con esta estructura:
{
  "title": "título final del artículo",
  "category": "categoría o categorías separadas por coma",
  "content": "todo el HTML generado"
}`;

        let response = await this.generate(prompt);
        
        // Limpiar posibles bloques de código que la IA a veces pone
        response = response.replace(/```json|```/g, "").trim();

        try {
            const data = JSON.parse(response);
            const wordCount = data.content.split(/\s+/).length;
            console.log(`[ArticleGenerator] Completado. ~${wordCount} palabras.`);

            return {
                title: data.title,
                content: data.content,
                wordCount,
                slug: this.slugify(topic),
                date: new Date().toLocaleDateString('es-ES', { month: 'short', year: 'numeric' }),
                author: "Editorial Keting",
                category: data.category
            };
        } catch (e) {
            console.error("[ArticleGenerator] Error parseando JSON de la IA. Reintentando extracción manual...");
            // Fallback si falla el JSON
            const h1Match = response.match(/<h1[^>]*>(.*?)<\/h1>/i);
            const extractedTitle = h1Match ? h1Match[1].replace(/<[^>]*>/g, "").trim() : topic;
            return {
                title: extractedTitle,
                content: response,
                wordCount: response.split(/\s+/).length,
                slug: this.slugify(topic),
                date: new Date().toLocaleDateString('es-ES', { month: 'short', year: 'numeric' }),
                author: "Editorial Keting",
                category: "Estrategia Digital"
            };
        }
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
