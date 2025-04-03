<template>
  <div>
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-lg font-semibold">申请历史</h2>
        <div class="flex space-x-2">
          <div class="relative">
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="搜索广告名称" 
              class="pl-8 pr-4 py-2 border rounded-md"
            >
            <Search class="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          </div>
          <select v-model="statusFilter" class="p-2 border rounded-md">
            <option value="all">全部状态</option>
            <option value="pending">待审核</option>
            <option value="approved">已通过</option>
            <option value="rejected">已拒绝</option>
            <option value="revision">需修改</option>
          </select>
        </div>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">广告名称</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">广告类型</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">提交日期</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(application, index) in filteredApplications" :key="index" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">{{ application.adName }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  :class="application.adType === '软广' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'" 
                  class="px-2 py-1 text-xs rounded-full"
                >
                  {{ application.adType }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">{{ application.submitDate }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  :class="{
                    'bg-yellow-100 text-yellow-800': application.status === '待审核',
                    'bg-green-100 text-green-800': application.status === '已通过',
                    'bg-red-100 text-red-800': application.status === '已拒绝',
                    'bg-orange-100 text-orange-800': application.status === '需修改'
                  }" 
                  class="px-2 py-1 text-xs rounded-full"
                >
                  {{ application.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <button 
                  @click="viewDetails(application)" 
                  class="text-blue-600 hover:text-blue-900 mr-3"
                >
                  查看
                </button>
                <button 
                  v-if="application.status === '已通过'"
                  @click="downloadContract(application)" 
                  class="text-green-600 hover:text-green-900"
                >
                  下载合同
                </button>
                <button 
                  v-if="application.status === '需修改'"
                  @click="editApplication(application)" 
                  class="text-orange-600 hover:text-orange-900"
                >
                  修改
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- 分页 -->
      <div class="flex justify-between items-center mt-6">
        <div class="text-sm text-gray-500">
          显示 {{ filteredApplications.length }} 条，共 {{ applications.length }} 条
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
    
    <!-- 详情弹窗 -->
    <div v-if="showDetails" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-lg font-semibold">广告申请详情</h3>
          <button @click="showDetails = false" class="text-gray-500 hover:text-gray-700">
            <X class="h-5 w-5" />
          </button>
        </div>
        
        <div class="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p class="text-sm text-gray-500">广告名称</p>
            <p class="font-medium">{{ selectedApplication.adName }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">广告类型</p>
            <p class="font-medium">{{ selectedApplication.adType }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">提交日期</p>
            <p class="font-medium">{{ selectedApplication.submitDate }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">状态</p>
            <p class="font-medium">{{ selectedApplication.status }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">公司名称</p>
            <p class="font-medium">{{ selectedApplication.companyName }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">联系人</p>
            <p class="font-medium">{{ selectedApplication.contactPerson }}</p>
          </div>
        </div>
        
        <!-- 软广特有字段 -->
        <div v-if="selectedApplication.adType === '软广'" class="mb-6">
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p class="text-sm text-gray-500">发布平台</p>
              <p class="font-medium">{{ selectedApplication.platform }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">发布时间</p>
              <p class="font-medium">{{ selectedApplication.publishTime }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">发布账号</p>
              <p class="font-medium">{{ selectedApplication.publishAccount }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">计费方式</p>
              <p class="font-medium">{{ selectedApplication.billingMethod }}</p>
            </div>
          </div>
          
          <div class="mb-4">
            <p class="text-sm text-gray-500">软文主题</p>
            <p class="font-medium">{{ selectedApplication.theme }}</p>
          </div>
          
          <div class="mb-4">
            <p class="text-sm text-gray-500">关键词</p>
            <p class="font-medium">{{ selectedApplication.keywords }}</p>
          </div>
        </div>
        
        <!-- 硬广特有字段 -->
        <div v-else class="mb-6">
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p class="text-sm text-gray-500">广告位置</p>
              <p class="font-medium">{{ selectedApplication.position }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">广告尺寸</p>
              <p class="font-medium">{{ selectedApplication.size }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">展示时间</p>
              <p class="font-medium">{{ selectedApplication.displayPeriod }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">计费方式</p>
              <p class="font-medium">{{ selectedApplication.billingMethod }}</p>
            </div>
          </div>
          
          <div class="mb-4">
            <p class="text-sm text-gray-500">广告文案</p>
            <p class="font-medium">{{ selectedApplication.copywriting }}</p>
          </div>
        </div>
        
        <!-- 审核意见 -->
        <div v-if="selectedApplication.feedback" class="mb-6 p-4 bg-gray-50 rounded-md">
          <p class="text-sm text-gray-500 mb-2">审核意见</p>
          <p>{{ selectedApplication.feedback }}</p>
        </div>
        
        <div class="flex justify-end">
          <button 
            @click="showDetails = false" 
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Search, X } from 'lucide-vue-next';

// 搜索和筛选
const searchQuery = ref('');
const statusFilter = ref('all');
const currentPage = ref(1);
const itemsPerPage = 10;

// 申请历史数据
const applications = ref([
  {
    adName: '夏季新品推广',
    adType: '软广',
    submitDate: '2023-06-15',
    status: '已通过',
    companyName: '时尚服饰有限公司',
    contactPerson: '张三',
    platform: '小红书',
    publishTime: '2023-07-01',
    publishAccount: 'fashion_style',
    billingMethod: '按阅读量',
    theme: '夏季清凉穿搭指南',
    keywords: '夏季,清凉,穿搭,时尚',
    feedback: '内容符合要求，已通过审核。'
  },
  {
    adName: '健康饮品推广',
    adType: '硬广',
    submitDate: '2023-06-18',
    status: '待审核',
    companyName: '健康饮品有限公司',
    contactPerson: '李四',
    position: '首页顶部',
    size: '728x90',
    displayPeriod: '2023-07-01 至 2023-07-31',
    billingMethod: 'CPM',
    copywriting: '清凉一夏，健康饮品伴你度过炎炎夏日！'
  },
  {
    adName: '美妆产品推广',
    adType: '软广',
    submitDate: '2023-06-10',
    status: '已拒绝',
    companyName: '美丽化妆品有限公司',
    contactPerson: '王五',
    platform: '抖音',
    publishTime: '2023-06-25',
    publishAccount: 'beauty_tips',
    billingMethod: '按互动量',
    theme: '夏日妆容教程',
    keywords: '美妆,夏日,妆容,教程',
    feedback: '内容与平台调性不符，建议调整后重新提交。'
  },
  {
    adName: '电子产品促销',
    adType: '硬广',
    submitDate: '2023-06-12',
    status: '需修改',
    companyName: '科技电子有限公司',
    contactPerson: '赵六',
    position: '侧边栏',
    size: '300x250',
    displayPeriod: '2023-06-20 至 2023-07-20',
    billingMethod: 'CPC',
    copywriting: '最新款电子产品，限时特惠！',
    feedback: '广告文案过于简单，建议增加产品特点和优势。'
  },
  {
    adName: '旅游套餐推广',
    adType: '软广',
    submitDate: '2023-06-08',
    status: '已通过',
    companyName: '快乐旅行社',
    contactPerson: '孙七',
    platform: '小红书',
    publishTime: '2023-06-15',
    publishAccount: 'travel_fun',
    billingMethod: '按发布次数',
    theme: '夏日避暑胜地推荐',
    keywords: '旅游,避暑,胜地,夏日',
    feedback: '内容丰富详实，已通过审核。'
  }
]);

// 筛选后的申请列表
const filteredApplications = computed(() => {
  let result = applications.value;
  
  // 状态筛选
  if (statusFilter.value !== 'all') {
    result = result.filter(app => {
      const statusMap = {
        'pending': '待审核',
        'approved': '已通过',
        'rejected': '已拒绝',
        'revision': '需修改'
      };
      return app.status === statusMap[statusFilter.value];
    });
  }
  
  // 搜索筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(app => 
      app.adName.toLowerCase().includes(query) || 
      app.companyName.toLowerCase().includes(query)
    );
  }
  
  return result;
});

// 总页数
const totalPages = computed(() => {
  return Math.ceil(filteredApplications.value.length / itemsPerPage);
});

// 详情弹窗
const showDetails = ref(false);
const selectedApplication = ref({});

const viewDetails = (application) => {
  selectedApplication.value = application;
  showDetails.value = true;
};

// 下载合同
const downloadContract = (application) => {
  alert(`正在下载 ${application.adName} 的合同...`);
  // 实际项目中这里会调用下载API
};

// 修改申请
const editApplication = (application) => {
  alert(`正在准备修改 ${application.adName} 的申请...`);
  // 实际项目中这里会跳转到编辑页面
};
</script>

