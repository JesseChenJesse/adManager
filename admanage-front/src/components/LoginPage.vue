<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
      <div class="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
        <h2 class="text-2xl font-bold text-white text-center">广告管理系统</h2>
        <p class="text-blue-100 text-center mt-2">新闻类社交媒体平台</p>
      </div>
      
      <div class="p-6">
        <form @submit.prevent="handleLogin">
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
              用户名
            </label>
            <input 
              v-model="username" 
              class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
              id="username" 
              type="text" 
              placeholder="请输入用户名"
              required
            >
          </div>
          
          <div class="mb-6">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
              密码
            </label>
            <input 
              v-model="password" 
              class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
              id="password" 
              type="password" 
              placeholder="请输入密码"
              required
            >
          </div>
          
          <div class="mb-6">
            <label class="block text-gray-700 text-sm font-bold mb-2">
              用户类型
            </label>
            <div class="flex space-x-4">
              <label class="inline-flex items-center">
                <input type="radio" v-model="userType" value="advertiser" class="form-radio text-blue-600">
                <span class="ml-2">广告主</span>
              </label>
              <label class="inline-flex items-center">
                <input type="radio" v-model="userType" value="admin" class="form-radio text-blue-600">
                <span class="ml-2">管理员</span>
              </label>
            </div>
          </div>
          
          <div class="flex items-center justify-between">
            <button 
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full" 
              type="submit"
              :disabled="isLoading"
            >
              {{ isLoading ? '登录中...' : '登录' }}
            </button>
          </div>
          
          <div v-if="errorMessage" class="mt-4 text-center text-red-500">
            {{ errorMessage }}
          </div>
          
          <div class="mt-4 text-center">
            <p class="text-gray-600">
              如果你没有账号，请 
              <router-link to="/register" class="text-blue-500 underline">注册</router-link>
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const username = ref('');
const password = ref('');
const userType = ref('advertiser');
const isLoading = ref(false);
const errorMessage = ref('');

const handleLogin = async () => {
  isLoading.value = true;
  errorMessage.value = '';

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username.value,
        password: password.value,
        userType: userType.value
      }),
    });

    const data = await response.json();
    
    if (response.ok) {
      // 检查用户角色与选择的类型是否匹配
      const expectedRole = userType.value === 'admin' ? '管理员' : '广告主';
      
      if (data.user.role !== expectedRole) {
        errorMessage.value = `账号类型错误，该账号是${data.user.role}，而非${expectedRole}`;
        isLoading.value = false;
        return;
      }
      
      // 保存token和用户信息
      localStorage.setItem('token', data.token);
      localStorage.setItem('userRole', data.user.role);
      localStorage.setItem('userId', data.user.id);
      localStorage.setItem('username', data.user.username);
      
      // 根据返回的重定向路径跳转
      router.push(data.user.redirectPath);
    } else {
      errorMessage.value = data.message || '用户名或密码错误';
    }
  } catch (error) {
    errorMessage.value = '登录失败，请稍后重试';
    console.error('Login error:', error);
  } finally {
    isLoading.value = false;
  }
};
</script>

