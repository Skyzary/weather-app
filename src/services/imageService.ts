import axios from "axios";
import i18n from '../i18n';

const BASE_URL = "https://api.unsplash.com/search/photos";
const accessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY


export const imageService = {
    /**
     * @param city - village name for search
     * @returns - {imageUrl, imageAlt} or undefined if error
     */
     abortController: new AbortController(),

    getCityImage: async (city: string) => {
        if (!city) return undefined;
        if (!accessKey || !accessKey.length ) throw new Error('API key is not defined')
        if (imageService.abortController) imageService.abortController.abort()
        imageService.abortController = new AbortController();


        const params = {
            query: city,
            client_id: accessKey,
            per_page: 1,
            orientation: "landscape",
        };

        try {
            const response = await axios.get(BASE_URL, { params, signal: imageService.abortController.signal });
            const result = response.data.results[0];

            if (result) {
                const optimizeUrl = new URL(result.urls.raw);
                optimizeUrl.searchParams.set("fm", "avif");
                optimizeUrl.searchParams.set("w", "1200");
                optimizeUrl.searchParams.set("fit", "crop");
                optimizeUrl.searchParams.set("q", "60");

                return {
                    imageUrl: optimizeUrl.toString(),
                    imageAlt: result.alt_description || i18n.t('weatherInCityImageAlt', { city })
                };
            }
            return undefined;
        } catch (error) {

            if(error instanceof Error){
                console.log('Error is' + error.message, error.cause)

            }
            if (axios.isCancel(error)) return undefined;
            if (axios.isAxiosError(error) && error.message) {
                if (error.response?.status === 401) {
                    throw new Error('authErrorUnsplash')
                }
                if (error.response?.status !== 401) {
                    throw new Error(
                        `Error fetching image data: ${error.message} `,
                        { cause: error }
                    );
                }
                }
            throw error;

        }
    }
};
