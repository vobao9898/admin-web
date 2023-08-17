import axios from "axios";
import { KEY_TOKEN, API_BASE_URL } from "contants";

const axiosClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "content-type": "application/json",
    },
});

axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem(KEY_TOKEN);
    config.headers.Authorization = `Bearer ${token}`;
    return config;
});

axiosClient.interceptors.response.use(
    (response) => {
        if (response?.data?.codeNumber === 401) {
            localStorage.clear();
            if (caches) {
                caches.keys().then((names) => {
                    for (const name of names) {
                        caches.delete(name);
                    }
                });
            }
            window.location.hash = "/login";
            setTimeout(() => {
                window.location.reload();
            });
        }
        if (response && response.data) {
            return response.data;
        }
        return response;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosClient;
