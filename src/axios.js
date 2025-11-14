import axios from "axios";

// Tạo instance Axios
const instance = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL,
    withCredentials: true, // gửi cookie (refreshToken) nếu server dùng cookie HttpOnly
});

// 🔹 REQUEST INTERCEPTOR
// Tự động gắn accessToken vào header Authorization
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

// 🔹 RESPONSE INTERCEPTOR
instance.interceptors.response.use(
    (response) => response.data, // chỉ trả data cho FE
    async (error) => {
        const originalRequest = error.config;

        // Nếu response 401 và chưa retry lần nào
        if (
            error.response &&
            error.response.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.includes("/api/login") && // bỏ qua login
            !originalRequest.url.includes("/api/register") // bỏ qua register
        ) {
            originalRequest._retry = true;

            try {
                // Gọi API refresh token
                const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/refresh-token`, {}, { withCredentials: true });

                if (res.data?.errCode === 0) {
                    // Lưu accessToken mới
                    localStorage.setItem("accessToken", res.data.accessToken);
                    // Gắn lại token cho request gốc
                    originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
                    // Retry lại request gốc
                    return axios(originalRequest);
                } else {
                    // Refresh token hết hạn → logout
                    localStorage.removeItem("accessToken");
                    window.location.href = "/login";
                }
            } catch (err) {
                console.error("Refresh token failed", err);
                localStorage.removeItem("accessToken");
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);

export default instance;
