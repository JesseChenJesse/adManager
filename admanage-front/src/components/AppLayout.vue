<template>
  <div class="flex flex-col h-screen bg-gray-100">
    <!-- 顶部导航栏 -->
    <div class="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg">
      <div class="container mx-auto px-4 py-3">
        <div class="flex items-center justify-between">
          <!-- 左侧系统标题 -->
          <div class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <div>
              <h2 class="text-white text-xl font-bold">广告管理系统</h2>
              <p class="text-blue-200 text-xs">{{ userRole === '广告主' ? '广告主控制台' : '管理员控制台' }}</p>
            </div>
          </div>
          
          <!-- 右侧用户信息 -->
          <div class="flex items-center space-x-4">
            <!-- 通知图标 -->
            <div class="relative">
              <button class="text-white hover:text-blue-200 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span>
              </button>
            </div>
            
            <!-- 用户信息下拉菜单 -->
            <div class="relative group">
              <button class="flex items-center space-x-2 text-white focus:outline-none">
                <div class="w-8 h-8 rounded-full bg-indigo-400 flex items-center justify-center text-white font-bold">
                  {{ username ? username.charAt(0).toUpperCase() : 'U' }}
                </div>
                <div class="hidden md:block text-left">
                  <p class="text-sm font-medium">{{ username || '未登录' }}</p>
                  <p class="text-xs text-blue-200">{{ userRole }}</p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <!-- 下拉菜单 -->
              <div class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">个人资料</a>
                <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">账号设置</a>
                <a href="#" @click.prevent="handleLogout" class="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">退出登录</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-1 overflow-hidden">
      <!-- 侧边栏 -->
      <aside class="w-64 bg-white shadow-lg flex flex-col h-full">
        <!-- 广告主菜单 -->
        <nav v-if="userRole === '广告主'" class="mt-2 flex-1 overflow-y-auto">
          <div class="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
            广告管理
          </div>
          <router-link 
            to="/advertiser/ad-application"
            class="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
            :class="{ 'bg-blue-50 text-blue-600 border-l-4 border-blue-600': isActive('/advertiser/ad-application') }"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            广告申请
          </router-link>
          <router-link 
            to="/advertiser/application-history"
            class="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
            :class="{ 'bg-blue-50 text-blue-600 border-l-4 border-blue-600': isActive('/advertiser/application-history') }"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            申请历史
          </router-link>
          <router-link 
            to="/advertiser/soft-content-review"
            class="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
            :class="{ 'bg-blue-50 text-blue-600 border-l-4 border-blue-600': isActive('/advertiser/soft-content-review') }"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            软文审核
          </router-link>
        </nav>

        <!-- 管理员菜单 -->
        <nav v-if="userRole === '管理员'" class="mt-2 flex-1 overflow-y-auto">
          <div class="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
            广告管理
          </div>
          <router-link 
            to="/admin/ad-management"
            class="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
            :class="{ 'bg-blue-50 text-blue-600 border-l-4 border-blue-600': isActive('/admin/ad-management') }"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            广告管理
          </router-link>
          <router-link 
            to="/admin/ad-review"
            class="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
            :class="{ 'bg-blue-50 text-blue-600 border-l-4 border-blue-600': isActive('/admin/ad-review') }"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            广告审核
          </router-link>
          
          <div class="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide mt-4">
            系统管理
          </div>
          <router-link 
            to="/admin/account-management"
            class="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
            :class="{ 'bg-blue-50 text-blue-600 border-l-4 border-blue-600': isActive('/admin/account-management') }"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            账号管理
          </router-link>
          <router-link 
            to="/admin/ai-copywriter"
            class="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
            :class="{ 'bg-blue-50 text-blue-600 border-l-4 border-blue-600': isActive('/admin/ai-copywriter') }"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            AI生成软文
          </router-link>
        </nav>

        <!-- 底部信息 -->
        <div class="p-4 mt-auto border-t border-gray-200">
          <div class="mb-4">
            <p class="text-xs text-gray-500">当前版本: v1.0.0</p>
            <p class="text-xs text-gray-500">最后登录: {{ formatDate(new Date()) }}</p>
          </div>
          <button 
            @click="handleLogout" 
            class="w-full flex items-center justify-center px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            退出登录
          </button>
        </div>
      </aside>

      <!-- 主内容区 -->
      <main class="flex-1 p-6 overflow-auto">
        <div class="bg-white rounded-lg shadow-md p-6 min-h-full">
          <router-view></router-view>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

// 用户信息
const userRole = ref(localStorage.getItem('userRole'));
const username = ref(localStorage.getItem('username'));
const userId = ref(localStorage.getItem('userId'));

const isActive = (path) => {
  return route.path.startsWith(path);
};

const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userId');
  localStorage.removeItem('username');
  router.push('/login');
};

const formatDate = (date) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return date.toLocaleDateString('zh-CN', options);
};

onMounted(() => {
  if (!userRole.value) {
    router.push('/login');
  }
});
</script>

<style scoped>
/* 下拉菜单组件 */
.dropdown {
  position: relative;
}

.dropdown:hover .dropdown-menu {
  display: block;
}

.dropdown-menu {
  min-width: 280px;
  border-radius: 12px;
  position: absolute;
  top: calc(100% + 5px) !important;
  right: 0;
  margin-top: 0;
  z-index: 1002;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  background-color: white;
  display: none;
}

.dropdown-menu::before {
  content: '';
  position: absolute;
  top: -8px;
  right: 20px;
  width: 16px;
  height: 16px;
  background: white;
  transform: rotate(45deg);
  z-index: -1;
}

.dropdown-trigger-area {
  position: absolute;
  bottom: -15px;
  left: 50%;
  transform: translateX(-50%);
  width: 160%;
  height: calc(100% + 40px);
  z-index: 1001;
}

.user-icon-wrapper {
  transition: all 0.2s;
  z-index: 1003;
}

.user-icon-wrapper:hover {
  opacity: 0.9;
  transform: scale(1.05);
}

.hover-scale {
  transition: all 0.2s;
}

.hover-scale:hover {
  transform: scale(1.05);
  opacity: 0.9;
}
</style>