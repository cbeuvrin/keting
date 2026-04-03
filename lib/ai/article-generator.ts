import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Generador de Artículos "Brain" de Keting Media
 * Utiliza Gemini 1.5 para crear contenido ultra-extenso (+2500 palabras)
 */
export class ArticleGenerator {
    private genAI: GoogleGenerativeAI;
    private model: any;

    constructor(apiKey: string) {
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    }

    /**
     * Genera una lista de temas tendencia
     */
    async generateTrends() {
        const trendPrompt = `Eres un estratega editorial de alto nivel de Keting Media. 
        Genera una lista de 5 temas tendencia en el sector de tecnología corporativa premium, diseño UX y transformación digital para hoy. 
        Formato: JSON puro con un array de strings ["tema 1", "tema 2"...]`;
        
        const trendResult = await this.model.generateContent(trendPrompt);
        const trendText = (await trendResult.response.text()).replace(/```json|```/g, "").trim();
        return JSON.parse(trendText);
    }

    /**
     * Genera un artículo completo de 2500+ palabras por secciones
     */
    async generateFullArticle(topic: string) {
        console.log(`Iniciando generación para: ${topic}`);

        // 1. Generar Outline
        const outlinePrompt = `Genera un esquema detallado (outline) para un artículo de blog sobre "${topic}" en español.
        El artículo debe ser de nivel experto, premium y editorial. 
        El esquema debe tener al menos 10 secciones (H2) y una conclusión.
        No devuelvas nada más que el JSON puro. No uses bloques de markdown con la palabra "json".
        Formato de salida: [ { "title": "string", "description": "string" } ]`;

        const outlineResult = await this.model.generateContent(outlinePrompt);
        let outlineText = await outlineResult.response.text();
        
        // Limpiar el texto si viene con markdown
        outlineText = outlineText.replace(/```json|```|```/g, "").trim();
        
        let sections;
        try {
            sections = JSON.parse(outlineText);
        } catch (e) {
            console.error("Fallo al parsear outline. Intentando limpieza agresiva...");
            const jsonMatch = outlineText.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                sections = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error("No se pudo obtener el esquema del artículo.");
            }
        }

        let fullContentHtml = "";
        let totalWords = 0;

        // 2. Generar cada sección
        for (const section of sections) {
            console.log(`Generando sección: ${section.title}`);
            const sectionPrompt = `Eres un experto redactor senior en Keting Media, una agencia de diseño y tecnología ultra-premium.
            Redacta la sección "${section.title}" del artículo "${topic}".
            Contexto de la sección: ${section.description}.
            
            REGLAS:
            1. Escribe al menos 400-500 palabras para esta sección.
            2. Usa un tono sofisticado, culto, directo y persuasivo.
            3. Devuelve el contenido en HTML semántico puro (H2, P, UL, LI, STRONG). No uses markdown.
            4. Inyecta conceptos técnicos avanzados y análisis de mercado realistas.
            5. No menciones que eres una IA. El lector debe creer que es una editorial humana de élite.`;

            const sectionResult = await this.model.generateContent(sectionPrompt);
            let sectionHtml = await sectionResult.response.text();
            
            // Limpiar posible markdown en la respuesta de la sección
            sectionHtml = sectionHtml.replace(/```html|```|```/g, "").trim();
            
            fullContentHtml += sectionHtml + "\n\n";
            totalWords += sectionHtml.split(/\s+/).length;
        }

        console.log(`Generación completada. Palabras aprox: ${totalWords}`);

        return {
            title: topic,
            content: fullContentHtml,
            wordCount: totalWords,
            slug: this.slugify(topic),
            date: new Date().toLocaleDateString('es-ES', { month: 'short', year: 'numeric' }),
            author: "IA Editorial Keting",
            category: "Inteligencia Artificial"
        };
    }

    private slugify(text: string) {
        return text.toString().toLowerCase()
            .replace(/\s+/g, '-')           // Replace spaces with -
            .replace(/[^\w-]+/g, '')       // Remove all non-word chars
            .replace(/--+/g, '-')         // Replace multiple - with single -
            .replace(/^-+/, '')             // Trim - from start of text
            .replace(/-+$/, '');            // Trim - from end of text
    }
}
