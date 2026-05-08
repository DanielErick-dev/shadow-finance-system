import axios from 'axios';

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
