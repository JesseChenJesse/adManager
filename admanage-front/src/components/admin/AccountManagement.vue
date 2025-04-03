<template>
  <div>
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-lg font-semibold">广告主账号管理</h2>
        <div class="flex space-x-2">
          <div class="relative">
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="搜索用户名/公司" 
              class="pl-8 pr-4 py-2 border rounded-md"
            >
            <Search class="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          </div>
          <select v-model="roleFilter" class="p-2 border rounded-md">
            <option value="all">全部角色</option>
            <option value="advertiser">广告主</option>
            <option value="admin">管理员</option>
            <option value="editor">广告编辑</option>
          </select>
          <button 
            @click="showAddUserModal = true" 
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            添加用户
          </button>
        </div>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">用户名</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">角色</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">公司/部门</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">邮箱</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">注册时间</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(user, index) in filteredUsers" :key="index" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">{{ user.username }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  :class="{
                    'bg-green-100 text-green-800': user.role === '广告主',
                    'bg-purple-100 text-purple-800': user.role === '管理员',
                    'bg-blue-100 text-blue-800': user.role === '广告编辑'
                  }" 
                  class="px-2 py-1 text-xs rounded-full"
                >
                  {{ user.role }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">{{ user.company }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ user.email }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ user.registerDate }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  :class="user.status === '活跃' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" 
                  class="px-2 py-1 text-xs rounded-full"
                >
                  {{ user.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <button 
                  @click="editUser(user)" 
                  class="text-blue-600 hover:text-blue-900 mr-3"
                >
                  编辑
                </button>
                <button 
                  v-if="user.status === '活跃'"
                  @click="toggleUserStatus(user)" 
                  class="text-red-600 hover:text-red-900"
                >
                  禁用
                </button>
                <button 
                  v-else
                  @click="toggleUserStatus(user)" 
                  class="text-green-600 hover:text-green-900"
                >
                  启用
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- 分页 -->
      <div class="flex justify-between items-center mt-6">
        <div class="text-sm text-gray-500">
          显示 {{ filteredUsers.length }} 条，共 {{ users.length }} 条
        </div>
        <div class="flex space-x-2">
          <button 
            class="px-3 py-1 border rounded-md hover:bg-gray-50"
            :disabled="currentPage === 1"
            @click="currentPage--"
          >
            上一页
          </button>
          <button 
            class="px-3 py-1 border rounded-md hover:bg-gray-50"
            :disabled="currentPage === totalPages"
            @click="currentPage++"
          >
            下一页
          </button>
        </div>
      </div>
    </div>
    
    <!-- 添加用户弹窗 -->
    <div v-if="showAddUserModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-lg font-semibold">添加用户</h3>
          <button @click="showAddUserModal = false" class="text-gray-500 hover:text-gray-700">
            <X class="h-5 w-5" />
          </button>
        </div>
        
        <form @submit.prevent="addUser">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">用户名</label>
            <input v-model="newUser.username" type="text" class="w-full p-2 border rounded-md" required>
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">密码</label>
            <input v-model="newUser.password" type="password" class="w-full p-2 border rounded-md" required>
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">角色</label>
            <select v-model="newUser.role" class="w-full p-2 border rounded-md" required>
              <option value="广告主">广告主</option>
              <option value="管理员">管理员</option>
              <option value="广告编辑">广告编辑</option>
            </select>
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">公司/部门</label>
            <input v-model="newUser.company" type="text" class="w-full p-2 border rounded-md" required>
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
            <input v-model="newUser.email" type="email" class="w-full p-2 border rounded-md" required>
          </div>
          
          <div class="flex justify-end">
            <button 
              type="button" 
              @click="showAddUserModal = false" 
              class="mr-4 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              取消
            </button>
            <button 
              type="submit" 
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              添加
            </button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- 编辑用户弹窗 -->
    <div v-if="showEditUserModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-lg font-semibold">编辑用户</h3>
          <button @click="showEditUserModal = false" class="text-gray-500 hover:text-gray-700">
            <X class="h-5 w-5" />
          </button>
        </div>
        
        <form @submit.prevent="updateUser">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">用户名</label>
            <input v-model="editingUser.username" type="text" class="w-full p-2 border rounded-md" required>
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">角色</label>
            <select v-model="editingUser.role" class="w-full p-2 border rounded-md" required>
              <option value="广告主">广告主</option>
              <option value="管理员">管理员</option>
              <option value="广告编辑">广告编辑</option>
            </select>
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">公司/部门</label>
            <input v-model="editingUser.company" type="text" class="w-full p-2 border rounded-md" required>
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
            <input v-model="editingUser.email" type="email" class="w-full p-2 border rounded-md" required>
          </div>
          
          <div class="flex justify-end">
            <button 
              type="button" 
              @click="showEditUserModal = false" 
              class="mr-4 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              取消
            </button>
            <button 
              type="submit" 
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Search, X } from 'lucide-vue-next';

// 搜索和筛选
const searchQuery = ref('');
const roleFilter = ref('all');
const currentPage = ref(1);
const itemsPerPage = 10;

// 用户数据
const users = ref([
  {
    username: 'zhang_san',
    role: '广告主',
    company: '时尚服饰有限公司',
    email: 'zhangsan@example.com',
    registerDate: '2023-01-15',
    status: '活跃'
  },
  {
    username: 'li_si',
    role: '广告主',
    company: '健康饮品有限公司',
    email: 'lisi@example.com',
    registerDate: '2023-02-20',
    status: '活跃'
  },
  {
    username: 'wang_wu',
    role: '广告主',
    company: '美丽化妆品有限公司',
    email: 'wangwu@example.com',
    registerDate: '2023-03-10',
    status: '禁用'
  },
  {
    username: 'admin_zhao',
    role: '管理员',
    company: '技术部',
    email: 'adminzhao@example.com',
    registerDate: '2022-12-01',
    status: '活跃'
  },
  {
    username: 'editor_sun',
    role: '广告编辑',
    company: '内容部',
    email: 'editorsun@example.com',
    registerDate: '2023-01-05',
    status: '活跃'
  }
]);

// 筛选后的用户列表
const filteredUsers = computed(() => {
  let result = users.value;
  
  // 角色筛选
  if (roleFilter.value !== 'all') {
    const roleMap = {
      'advertiser': '广告主',
      'admin': '管理员',
      'editor': '广告编辑'
    };
    result = result.filter(user => user.role === roleMap[roleFilter.value]);
  }
  
  // 搜索筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(user => 
      user.username.toLowerCase().includes(query) || 
      user.company.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    );
  }
  
  return result;
});

// 总页数
const totalPages = computed(() => {
  return Math.ceil(filteredUsers.value.length / itemsPerPage);
});

// 添加用户
const showAddUserModal = ref(false);
const newUser = ref({
  username: '',
  password: '',
  role: '广告主',
  company: '',
  email: ''
});

const addUser = () => {
  // 添加新用户
  users.value.push({
    ...newUser.value,
    registerDate: new Date().toISOString().split('T')[0],
    status: '活跃'
  });
  
  // 重置表单并关闭弹窗
  newUser.value = {
    username: '',
    password: '',
    role: '广告主',
    company: '',
    email: ''
  };
  showAddUserModal.value = false;
};

// 编辑用户
const showEditUserModal = ref(false);
const editingUser = ref({});
const editingIndex = ref(-1);

const editUser = (user) => {
  // 找到用户索引
  const index = users.value.findIndex(u => u.username === user.username);
  if (index !== -1) {
    editingIndex.value = index;
    // 复制用户数据以避免直接修改
    editingUser.value = { ...user };
    showEditUserModal.value = true;
  }
};

const updateUser = () => {
  if (editingIndex.value !== -1) {
    // 更新用户数据
    users.value[editingIndex.value] = { ...editingUser.value };
    showEditUserModal.value = false;
  }
};

// 切换用户状态
const toggleUserStatus = (user) => {
  const index = users.value.findIndex(u => u.username === user.username);
  if (index !== -1) {
    users.value[index].status = user.status === '活跃' ? '禁用' : '活跃';
  }
};
</script>

