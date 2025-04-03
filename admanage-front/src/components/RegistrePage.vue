<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
      <div class="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
        <h2 class="text-2xl font-bold text-white text-center">广告主注册</h2>
        <p class="text-blue-100 text-center mt-2">欢迎加入广告管理系统</p>
      </div>
      
      <div class="p-6">
        <form @submit.prevent="handleRegister">
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

          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
              邮箱
            </label>
            <input 
              v-model="email" 
              class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
              id="email" 
              type="email" 
              placeholder="请输入邮箱"
              required
            >
          </div>

          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="company">
              公司名称
            </label>
            <input 
              v-model="company" 
              class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
              id="company" 
              type="text" 
              placeholder="请输入公司名称"
              required
            >
          </div>

          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="phone">
              联系电话
            </label>
            <input 
              v-model="phone" 
              class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
              id="phone" 
              type="text" 
              placeholder="请输入联系电话"
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

          <div class="flex items-center justify-between">
            <button 
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full" 
              type="submit"
              :disabled="isLoading"
            >
              {{ isLoading ? '注册中...' : '注册' }}
            </button>
          </div>

          <div v-if="errorMessage" class="mt-4 text-center text-red-500">
            {{ errorMessage }}
          </div>

          <div class="mt-4 text-center">
            <p class="text-gray-600">
              已有账号？请 
              <router-link to="/login" class="text-blue-500 underline">登录</router-link>
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
const email = ref('');
const company = ref('');
const phone = ref('');
const password = ref('');
const isLoading = ref(false);
const errorMessage = ref('');

const handleRegister = async () => {
  isLoading.value = true;
  errorMessage.value = '';

  try {
    // 添加客户端验证
    if (!username.value || !email.value || !password.value || !company.value || !phone.value) {
      errorMessage.value = '请填写所有必填字段';
      isLoading.value = false;
      return;
    }

    if (password.value.length < 6) {
      errorMessage.value = '密码长度至少需要6个字符';
      isLoading.value = false;
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      errorMessage.value = '请输入有效的邮箱地址';
      isLoading.value = false;
      return;
    }
    
    console.log('注册请求:', { 
      username: username.value, 
      password: password.value, 
      email: email.value, 
      company: company.value, 
      phone: phone.value 
    });
    
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        username: username.value, 
        password: password.value, 
        email: email.value, 
        company: company.value, 
        phone: phone.value 
      }),
    });

    console.log('API请求地址:', `${import.meta.env.VITE_API_URL}/auth/register`);
    console.log('请求状态:', response.status, response.statusText);

    // 尝试获取响应文本
    let responseText;
    try {
      responseText = await response.text();
      console.log('服务器原始响应:', responseText);
    } catch (e) {
      console.error('无法读取响应文本:', e);
    }

    // 尝试解析JSON
    let data;
    try {
      data = responseText ? JSON.parse(responseText) : null;
      console.log('注册响应(JSON):', data);
    } catch (e) {
      console.error('JSON解析错误:', e, '原始文本:', responseText);
      errorMessage.value = `服务器返回了无效的响应格式 (${responseText.substring(0, 50)}...)`;
      isLoading.value = false;
      return;
    }
    
    if (response.ok && data && data.success) {
      // 注册成功，跳转到登录页面
      alert('注册成功！即将跳转到登录页面。');
      router.push('/login');
    } else {
      // 处理各种错误情况
      if (data && data.message) {
        errorMessage.value = data.message;
      } else if (response.status === 404) {
        errorMessage.value = '无法连接到服务器API，请确认后端服务是否正常运行';
      } else if (response.status === 500) {
        errorMessage.value = '服务器内部错误，请联系管理员';
      } else {
        errorMessage.value = `注册失败 (HTTP ${response.status})`;
      }
    }
  } catch (error) {
    console.error('注册错误:', error);
    
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      errorMessage.value = '无法连接到服务器，请检查网络连接或确认后端服务是否启动';
    } else {
      errorMessage.value = `注册失败: ${error.message}`;
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* 可以在这里添加自定义样式 */
</style>
