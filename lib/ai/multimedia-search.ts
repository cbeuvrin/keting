/**
 * Buscador de Multimedia de Keting Media
 */
export class MultimediaSearch {
    private unsplashKey: string;
    private youtubeKey: string;

    constructor(unsplashKey: string, youtubeKey: string) {
        this.unsplashKey = unsplashKey;
        this.youtubeKey = youtubeKey;
    }

    /**
     * Busca una imagen premium en Unsplash
     */
    async searchImage(query: string) {
        try {
            const response = await fetch(
                `https://api.unsplash.com/search/photos?page=1&query=${encodeURIComponent(query)}&orientation=landscape`,
                {
                    headers: {
                        Authorization: `Client-ID ${this.unsplashKey}`
                    }
                }
            );
            const data = await response.json();
            if (data.results && data.results.length > 0) {
                return data.results[0].urls.regular; // La imagen más relevante
            }
            return "/images/blog/default.png"; // Fallback local
        } catch (error) {
            console.error("Error buscando imagen Unsplash:", error);
            return "/images/blog/default.png";
        }
    }

    /**
     * Busca un video de YouTube para embeber
     */
    async searchYouTubeVideo(query: string) {
        try {
            const response = await fetch(
                `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${encodeURIComponent(query)}&type=video&key=${this.youtubeKey}`
            );
            const data = await response.json();
            if (data.items && data.items.length > 0) {
                const videoId = data.items[0].id.videoId;
                return videoId;
            }
            return null;
        } catch (error) {
            console.error("Error buscando video YouTube:", error);
            return null;
        }
    }
}
