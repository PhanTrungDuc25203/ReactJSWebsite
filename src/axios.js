import axios from "axios";

const instance = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL,
    withCredentials: true,
});

// ----------------
// TOKEN REFRESH QUEUE
// ----------------
let isRefreshing = false;
let refreshSubscribers = [];

function subscribeTokenRefresh(cb) {
    refreshSubscribers.push(cb);
}

function onRefreshed(newToken) {
    refreshSubscribers.forEach((cb) => cb(newToken));
    refreshSubscribers = [];
}

// ----------------
// REQUEST INTERCEPTOR
// ----------------
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ----------------
// RESPONSE INTERCEPTOR
// ----------------
instance.interceptors.response.use(
    (response) => response.data,
    async (error) => {
        const originalRequest = error.config;

        // Không phải lỗi 401 → trả ra luôn
        if (!error.response || error.response.status !== 401) {
            return Promise.reject(error);
        }

        // Không refresh ở login/register
        if (originalRequest.url.includes("/api/login") || originalRequest.url.includes("/api/register")) {
            return Promise.reject(error);
        }

        // Đã retry rồi mà vẫn 401 → logout
        if (originalRequest._retry) {
            localStorage.removeItem("accessToken");
            window.location.href = "/login";
            return Promise.reject(error);
        }

        // Đánh dấu đã retry
        originalRequest._retry = true;

        // -------- CASE 1: ĐÃ CÓ REFRESH REQUEST ĐANG CHẠY ----------
        if (isRefreshing) {
            return new Promise((resolve) => {
                subscribeTokenRefresh((token) => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    resolve(instance(originalRequest));
                });
            });
        }

        // -------- CASE 2: BẮT ĐẦU REFRESH TOKEN -----------
        isRefreshing = true;

        try {
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/refresh-token`, {}, { withCredentials: true });

            if (res.data?.errCode !== 0) {
                throw new Error("Invalid refresh");
            }

            const newToken = res.data.accessToken;
            localStorage.setItem("accessToken", newToken);

            // Gán lại cho instance (request sau dùng token mới)
            instance.defaults.headers.Authorization = `Bearer ${newToken}`;

            // Báo cho tất cả requests đợi token
            isRefreshing = false;
            onRefreshed(newToken);

            // Gửi lại request gốc
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return instance(originalRequest);
        } catch (refreshError) {
            isRefreshing = false;
            localStorage.removeItem("accessToken");
            window.location.href = "/login";
            return Promise.reject(refreshError);
        }
    }
);

export default instance;
