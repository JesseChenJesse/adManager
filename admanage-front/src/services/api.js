import axios from 'axios';

// 创建axios实例
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1', // 使用 Vite 的环境变量
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// 请求拦截器 - 添加token到请求头
api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// 响应拦截器 - 处理常见错误
api.interceptors.response.use(
    response => {
        return response.data;
    },
    error => {
        // 处理401错误 - 未授权/token过期
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error.response ? error.response.data : error);
    }
);

// 身份验证相关API
export const authAPI = {
    login: (username, password, userType) => {
        return api.post('/auth/login', { username, password, userType });
    },
    getCurrentUser: () => {
        return api.get('/auth/me');
    }
};

// 广告相关API
export const advertisementAPI = {
    create: (adData) => {
        return api.post('/advertisements', adData);
    },
    getAll: (params) => {
        return api.get('/advertisements', { params });
    },
    getById: (id) => {
        return api.get(`/advertisements/${id}`);
    },
    updateStatus: (id, status, feedback) => {
        return api.put(`/advertisements/${id}/status`, { status, feedback });
    }
};

// 软广内容相关API
export const softAdContentAPI = {
    create: (contentData) => {
        return api.post('/softAdContents', contentData);
    },
    getAll: (params) => {
        return api.get('/softAdContents', { params });
    },
    getById: (id) => {
        return api.get(`/softAdContents/${id}`);
    },
    update: (id, contentData) => {
        return api.put(`/softAdContents/${id}`, contentData);
    }
};

// 内容审核相关API
export const contentReviewAPI = {
    getAll: (params) => {
        return api.get('/contentReviews', { params });
    },
    getPending: (params) => {
        return api.get('/contentReviews/pending', { params });
    },
    getById: (id) => {
        return api.get(`/contentReviews/${id}`);
    },
    submitReview: (id, status, feedback) => {
        return api.put(`/contentReviews/${id}`, { status, feedback });
    }
};

// 合同相关API
export const contractAPI = {
    
    create: (contractData) => {
        return api.post('/contracts', contractData);
    },
    getAll: (params) => {
        return api.get('/contracts', { params });
    },
    getById: (id) => {
        return api.get(`/contracts/${id}`);
    },
    sign: (id) => {
        return api.put(`/contracts/${id}/sign`);
    }
};

// 通知相关API
export const notificationAPI = {
    getAll: (params) => {
        return api.get('/notifications', { params });
    },
    getUnreadCount: () => {
        return api.get('/notifications/unread-count');
    },
    markAsRead: (id) => {
        return api.put(`/notifications/${id}/read`);
    },
    markAllAsRead: () => {
        return api.put('/notifications/mark-all-read');
    }
};

export default api;
