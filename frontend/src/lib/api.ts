import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config; 
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; 

            try {
                const refreshToken = localStorage.getItem('refresh_token');
                if (!refreshToken) {
                    localStorage.removeItem('access_token');
                    window.location.href = '/auth/login';
                    return Promise.reject(error);
                }
                const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}token/refresh/`, {
                    refresh: refreshToken
                });
                const newAccessToken = response.data.access;
                localStorage.setItem('access_token', newAccessToken);
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);

            } catch (refreshError) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                window.location.href = '/auth/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
