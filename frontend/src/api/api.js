import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5001/api/',
    withCredentials: true,
});

api.interceptors.response.use(
    response => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                try {
                    const response = await api.post('/auth/refresh', { refreshToken });
                    const newAccessToken = response.data.accessToken;
                    localStorage.setItem('token', newAccessToken);
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return api(originalRequest); // Gửi lại request ban đầu với access token mới
                } catch (refreshError) {
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                }
            } else {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;

// const baseURL = 'http://localhost:5000/api/';

// export const register = (userData) => axios.post(`${baseURL}/auth/register`, userData);
// export const login = (userData) => axios.post(`${baseURL}/auth/login`, userData);
// export const getProfile = () => {
//     const token = localStorage.getItem('token') || sessionStorage.getItem('token');
//     return axios.get(`${baseURL}/auth/profile`, {
//         headers: {
//             Authorization: `Bearer ${token}`,
//         },
//     });
// };
