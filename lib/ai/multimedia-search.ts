import { GoogleGenAI } from "@google/genai";
import { createClient } from "@supabase/supabase-js";

/**
 * Generador de Multimedia de Keting Media
 * - Usa Gemini (gemini-2.0-flash-exp) para generar imágenes
 * - Las sube a Supabase Storage para tener URLs permanentes
 * - Usa YouTube para videos relacionados
 */
export class MultimediaSearch {
    private geminiKey: string;
    private youtubeKey: string;
    private supabase: ReturnType<typeof createClient>;

    constructor(geminiKey: string, youtubeKey: string, supabaseUrl: string, supabaseServiceKey: string) {
        this.geminiKey = geminiKey;
        this.youtubeKey = youtubeKey;
        this.supabase = createClient(supabaseUrl, supabaseServiceKey);
    }

    /**
     * Genera una imagen con Gemini AI, la sube a Supabase Storage
     * y devuelve una URL permanente.
     */
    async generateAndStoreImage(title: string, category: string, slug: string): Promise<string> {
        try {
            const ai = new GoogleGenAI({ apiKey: this.geminiKey });

            const prompt = `A cinematic, premium blog header image for an article about: "${title}". Category: ${category}. Style: futuristic corporate digital art, dark blue and teal color palette, minimalist, high-tech, 8k quality. No text. No people.`;

            // Use Imagen 4.0 — best quality, permanent generation
            const response = await ai.models.generateImages({
                model: "imagen-4.0-generate-001",
                prompt,
                config: {
                    numberOfImages: 1,
                    aspectRatio: "16:9",
                    outputMimeType: "image/jpeg",
                },
            } as any);

            const imageBytes = (response as any)?.generatedImages?.[0]?.image?.imageBytes;

            if (!imageBytes) {
                console.warn("[MultimediaSearch] No image data from Imagen 4.0");
                return "/images/blog/default.png";
            }

            const imageBuffer = Buffer.from(imageBytes, "base64");

            // Ensure bucket exists
            await this.ensureBucketExists();

            // Upload to Supabase Storage
            const fileName = `articles/${slug}.jpg`;
            const { error: uploadError } = await this.supabase.storage
                .from("blog-images")
                .upload(fileName, imageBuffer, {
                    contentType: "image/jpeg",
                    upsert: true,
                });

            if (uploadError) {
                console.error("[MultimediaSearch] Upload error:", uploadError);
                return "/images/blog/default.png";
            }

            // Get permanent public URL
            const { data: urlData } = this.supabase.storage
                .from("blog-images")
                .getPublicUrl(fileName);

            console.log(`[MultimediaSearch] Image stored permanently: ${urlData.publicUrl}`);
            return urlData.publicUrl;

        } catch (error) {
            console.error("[MultimediaSearch] Error generating/storing image:", error);
            return "/images/blog/default.png";
        }
    }

    /**
     * Ensures the 'blog-images' storage bucket exists and is public.
     */
    private async ensureBucketExists() {
        const { data: buckets } = await this.supabase.storage.listBuckets();
        const exists = buckets?.some(b => b.name === "blog-images");
        if (!exists) {
            await this.supabase.storage.createBucket("blog-images", {
                public: true,
                fileSizeLimit: 10485760, // 10MB
            });
            console.log("[MultimediaSearch] Created 'blog-images' bucket in Supabase Storage");
        }
    }

    /**
     * Busca un video de YouTube para embeber
     */
    async searchYouTubeVideo(query: string): Promise<string | null> {
        if (!this.youtubeKey) return null;
        try {
            const response = await fetch(
                `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${encodeURIComponent(query + " business strategy")}&type=video&key=${this.youtubeKey}`
            );
            const data = await response.json();
            if (data.items && data.items.length > 0) {
                return data.items[0].id.videoId;
            }
            return null;
        } catch (error) {
            console.error("[MultimediaSearch] Error fetching YouTube video:", error);
            return null;
        }
    }
}
