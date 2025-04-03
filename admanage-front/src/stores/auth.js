import { defineStore } from 'pinia';
import { authAPI } from '../services/api';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: JSON.parse(localStorage.getItem('user')) || null,
        token: localStorage.getItem('token') || null,
        loading: false,
        error: null
    }),

    getters: {
        isAuthenticated: (state) => !!state.token,
        isAdmin: (state) => state.user && state.user.role === 'admin',
        isAdvertiser: (state) => state.user && state.user.role === 'advertiser',
        isEditor: (state) => state.user && state.user.role === 'editor',
        userRole: (state) => state.user ? state.user.role : null
    },

    actions: {
        async login(username, password, userType) {
            this.loading = true;
            this.error = null;

            try {
                const response = await authAPI.login(username, password, userType);
                this.user = response.data.user;
                this.token = response.data.token;

                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));

                return response;
            } catch (error) {
                this.error = error.message || '登录失败';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async fetchCurrentUser() {
            if (!this.token) return;

            this.loading = true;

            try {
                const response = await authAPI.getCurrentUser();
                this.user = response.data;
                localStorage.setItem('user', JSON.stringify(response.data));
            } catch (error) {
                this.logout();
            } finally {
                this.loading = false;
            }
        },

        logout() {
            this.user = null;
            this.token = null;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    }
});
