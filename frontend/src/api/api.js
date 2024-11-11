import axios from 'axios';

// Tạo một instance của axios với baseURL
const api = axios.create({
  baseURL: 'http://localhost:5001/api',
  withCredentials: true,  // Để gửi cookie với các yêu cầu
});

// Hàm để refresh access token
const refreshAccessToken = async () => {
    try {
        console.log("Attempting to refresh access token");
        const { data } = await api.get('/auth/refresh-token', { withCredentials: true });
        localStorage.setItem('accessToken', data.accessToken);
        console.log("New access token obtained:", data.accessToken);
        return data.accessToken;
    } catch (error) {
        console.error("Failed to refresh access token:", error);
        throw error;
    }
};

// Thêm interceptor
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        console.log("Interceptor caught error:", error);

        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry) {
            console.log("Token expired, attempting refresh...");
            originalRequest._retry = true;

            try {
                const newToken = await refreshAccessToken();
                originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                console.log("Retrying original request with new token:", newToken);
                return api(originalRequest);
            } catch (refreshError) {
                alert("Token expired. Please log in again.");
                console.error("Failed to refresh token:", refreshError);
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);




export default api;
