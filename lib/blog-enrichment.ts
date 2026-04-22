
import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Blog Enrichment Service
 * This service uses Gemini to generate professional prompts and
 * Pollinations.ai to generate high-quality AI images.
 */

export async function fetchAIImage(title: string, category: string): Promise<string | null> {
    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey) {
        console.warn("GEMINI_API_KEY is missing for image prompt generation");
        return null;
    }

    try {
        const genAI = new GoogleGenerativeAI(geminiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // 1. Generate a professional image prompt using Gemini
        const promptGen = `Generate a short, highly descriptive English image prompt for a professional blog header about: "${title}". 
        Category: ${category}. 
        Style: Professional, clean, futuristic, high-end photography, cinematic lighting. 
        Avoid text in the image. Return ONLY the prompt, nothing else.`;

        const result = await model.generateContent(promptGen);
        const aiPrompt = result.response.text().trim();

        // 2. Generate the image URL using Pollinations.ai
        // We use a seed for deterministic images or random for variety
        const seed = Math.floor(Math.random() * 1000000);
        const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(aiPrompt)}?width=1280&height=720&nologo=true&seed=${seed}`;

        return imageUrl;
    } catch (error) {
        console.error("Error generating AI image:", error);
        return null;
    }
}

export async function fetchYoutubeVideoId(query: string): Promise<string | null> {
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
        console.warn("YOUTUBE_API_KEY is missing");
        return null;
    }

    try {
        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query + " business strategy")}&maxResults=1&type=video&key=${apiKey}`
        );

        if (!response.ok) throw new Error(`YouTube API error: ${response.statusText}`);
        
        const data = await response.json();
        return data.items[0]?.id?.videoId || null;
    } catch (error) {
        console.error("Error fetching YouTube video:", error);
        return null;
    }
}

/**
 * Enriches an article object with real assets if missing.
 */
export async function enrichArticle(title: string, category: string = "Business", currentImage?: string): Promise<{ image?: string, youtube_id?: string }> {
    const results: { image?: string, youtube_id?: string } = {};

    // Only fetch image if it's the default one or missing
    const isDefaultImage = !currentImage || currentImage.includes('default') || currentImage.includes('placeholder') || currentImage.includes('unsplash');
    
    if (isDefaultImage) {
        const imageUrl = await fetchAIImage(title, category);
        if (imageUrl) results.image = imageUrl;
    }

    const videoId = await fetchYoutubeVideoId(title);
    if (videoId) results.youtube_id = videoId;

    return results;
}
