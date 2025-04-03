import { createRouter, createWebHistory } from "vue-router"
import LoginPage from "../components/LoginPage.vue"
import AppLayout from "../components/AppLayout.vue"
import RegistrePage from "../components/RegistrePage.vue"
import AdApplication from "../components/advertiser/AdApplication.vue"
import ApplicationHistory from "../components/advertiser/ApplicationHistory.vue"
import SoftContentReview from "../components/advertiser/SoftContentReview.vue"
import AdManagement from "../components/admin/AdManagement.vue"
import AdReview from "../components/admin/AdReview.vue"
import AccountManagement from "../components/admin/AccountManagement.vue"
import AiCopywriter from "../components/admin/AiCopywriter.vue"

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    component: LoginPage,
  },
  {
    path: '/register',
    name: 'Register',
    component: RegistrePage
  },
  // 广告主路由
  {
    path: "/advertiser",
    component: AppLayout,
    children: [
      {
        path: "ad-application",
        component: AdApplication,
      },
      {
        path: "application-history",
        component: ApplicationHistory,
      },
      {
        path: "soft-content-review",
        component: SoftContentReview,
      },
      {
        path: "",
        redirect: "/advertiser/ad-application"
      }
    ]
  },
  // 管理员路由
  {
    path: "/admin",
    component: AppLayout,
    children: [
      {
        path: "ad-management",
        component: AdManagement,
      },
      {
        path: "ad-review",
        component: AdReview,
      },
      {
        path: "account-management",
        component: AccountManagement,
      },
      {
        path: "ai-copywriter",
        component: AiCopywriter,
      },
      {
        path: "",
        redirect: "/admin/ad-management"
      }
    ]
  },
  // 保留旧路由以兼容
  {
    path: "/advertiser-dashboard",
    redirect: "/advertiser/ad-application",
  },
  {
    path: "/admin-dashboard",
    redirect: "/admin/ad-management",
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router

