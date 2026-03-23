import axios from "axios";
import iziToast from "izitoast";

const BASE_URL = "https://api.unsplash.com/search/photos";
const accessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY
const abortController = new AbortController()


export const imageService = {
    abortController: abortController,
    /**
     * @Param city - village name for search
     * @returns - {imageUrl, imageAlt} or undefined if error
     */

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
                    imageAlt: result.alt_description || `Погода в городе ${city}`
                };
            }
            return undefined;
        } catch (error) {
            if(error instanceof Error){
                console.log('Error is' + error.message, error.cause)

            }
            if (axios.isCancel(error)) return Promise.reject('Request aborted');
            if (axios.isAxiosError(error) && error.message) {
                if (error.response?.status === 401) {
                    iziToast.error({
                        title: "Ошибка",
                        message: "Unsplash:  Ошибка авторизации",
                        position: "topCenter",
                    })
                }
                if (error.response?.status !== 401) {
                    throw new Error(
                        `Error fetching image data: ${error.message} `,
                        { cause: error }
                    );
                }
                }

            return undefined;
        }
    }
};
