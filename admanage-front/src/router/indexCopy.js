import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import LoginPage from '../components/LoginPage.vue';
import AppLayout from '../components/AppLayout.vue';
import RegistrePage from '../components/RegistrePage.vue';

// 广告主页面
import AdApplication from '../components/advertiser/AdApplication.vue';
import ApplicationHistory from '../components/advertiser/ApplicationHistory.vue';
import SoftContentReview from '../components/advertiser/SoftContentReview.vue';

// 管理员页面
import AccountManagement from '../components/admin/AccountManagement.vue';
import AdReview from '../components/admin/AdReview.vue';
import AiCopywriter from '../components/admin/AiCopywriter.vue';
import AdManagement from '../components/admin/AdManagement.vue';

const routes = [
    {
        path: '/',
        redirect: '/login'  // 添加重定向
    },
    {
        path: '/login',
        name: 'Login',
        component: LoginPage
    },
    {
        path: '/register',
        name: 'Register',
        component: RegistrePage
    },
    // 广告主路由
    {
        path: '/advertiser',
        component: AppLayout,
        meta: { requiresAuth: true, role: '广告主' },
        children: [
            {
                path: '',
                redirect: '/advertiser/ad-application'
            },
            {
                path: 'ad-application',
                name: 'AdApplication',
                component: AdApplication
            },
            {
                path: 'application-history',
                name: 'ApplicationHistory',
                component: ApplicationHistory
            },
            {
                path: 'soft-content-review',
                name: 'SoftContentReview',
                component: SoftContentReview
            }
        ]
    },
    // 管理员路由
    {
        path: '/admin',
        component: AppLayout,
        meta: { requiresAuth: true, role: '管理员' },
        children: [
            {
                path: '',
                redirect: '/admin/ad-management'
            },
            {
                path: 'ad-management',
                name: 'AdManagement',
                component: AdManagement
            },
            {
                path: 'account-management',
                name: 'AccountManagement',
                component: AccountManagement
            },
            {
                path: 'ad-review',
                name: 'AdReview',
                component: AdReview
            },
            {
                path: 'ai-copywriter',
                name: 'AiCopywriter',
                component: AiCopywriter
            }
        ]
    },
    // 404页面
    {
        path: '/:pathMatch(.*)*',
        redirect: '/'
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

// 路由守卫
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    console.log(to,'to-----')
    if (to.meta.requiresAuth && !token) {
        next('/login');
    } else if (to.meta.role && to.meta.role !== userRole) {
        next('/login');
    } else {
        next();
    }
});

export default router;
