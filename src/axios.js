import axios from "axios";
import _ from "lodash";
import config from "./config";

const instance = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL,
    // withCredentials: true
});

// 🔹 NEW: Interceptor cho REQUEST — tự động gắn token vào header
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken"); // lấy token đã lưu khi login
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor cho RESPONSE — xử lý dữ liệu trả về
instance.interceptors.response.use(
    (response) => {
        const { data } = response;
        return data; // backend trả JSON nên ta chỉ cần lấy data
    },
    (error) => {
        // 🔹 Bạn có thể xử lý lỗi JWT ở đây (nếu token hết hạn)
        if (error.response && error.response.status === 401) {
            console.warn("⚠️ Token hết hạn hoặc không hợp lệ.");
            // Có thể logout hoặc điều hướng về trang login
        }
        return Promise.reject(error);
    }
);

export default instance;
