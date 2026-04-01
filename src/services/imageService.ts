import axios from "axios";

const BASE_URL = "https://api.unsplash.com/search/photos";
export const imageService = {
    /**
     * @Param city - village name for search
     * @returns - {imageUrl, imageAlt} or undefined if error
     */

    getCityImage: async (city: string) => {
        const currentKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
        if (!city) return undefined;
        if (!currentKey || !currentKey.length ) throw new Error('API key is not defined')


        const params = {
            query: city,
            client_id: currentKey,
            per_page: 1,
            orientation: "landscape",
        };

        try {
            const response = await axios.get(BASE_URL, { params });
            const result = response.data.results[0];

            if (result) {
                const optimizeUrl = new URL(result.urls.raw);
                optimizeUrl.searchParams.set("fm", "avif");
                optimizeUrl.searchParams.set("w", "1200");
                optimizeUrl.searchParams.set("fit", "crop");
                optimizeUrl.searchParams.set("q", "60");

                return {
                    imageUrl: optimizeUrl.toString(),
                    imageAlt: result.alt_description || `Погода в городе ${city}`
                };
            }
            return undefined;
        } catch (error) {
            console.error("Error fetching image from Unsplash:", error);
            return undefined;
        }
    }
}