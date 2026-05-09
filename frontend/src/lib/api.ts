import axios from 'axios';

export function extractApiError(error: unknown, fallback: string): string {
    if (!axios.isAxiosError(error)) return fallback;
    const data = error.response?.data;
    if (!data) return fallback;
    if (typeof data.detail === 'string') return data.detail;
    if (Array.isArray(data.non_field_errors)) return data.non_field_errors[0];
    const firstField = Object.keys(data)[0];
    if (firstField) {
        const msg = data[firstField];
        return Array.isArray(msg) ? msg[0] : String(msg);
    }
    return fallback;
}

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    withCredentials: true,
});


api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config
        const isRefreshEndpoint = originalRequest.url?.includes('token/refresh')

        if (error.response?.status === 401 && !originalRequest._retry && !isRefreshEndpoint) {
            originalRequest._retry = true
            try {
                await api.post('token/refresh/')
                return api(originalRequest)
            } catch {
                if (window.location.pathname !== '/auth/login') {
                    window.location.href = '/auth/login'
                }
                return Promise.reject(error)
            }
        }
        return Promise.reject(error)
    }
)

export default api;
