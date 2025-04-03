<!--管理员仪表盘-->

<template>
  <div>
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-lg font-semibold">广告管理</h2>
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
          <select v-model="typeFilter" class="p-2 border rounded-md">
            <option value="all">全部类型</option>
            <option value="soft">软广</option>
            <option value="hard">硬广</option>
          </select>
          <select v-model="statusFilter" class="p-2 border rounded-md">
            <option value="all">全部状态</option>
            <option value="active">进行中</option>
            <option value="scheduled">待投放</option>
            <option value="completed">已结束</option>
          </select>
        </div>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">广告名称</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">广告类型</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">广告主</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">投放时间</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(ad, index) in filteredAds" :key="index" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">{{ ad.adName }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  :class="ad.adType === '软广' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'" 
                  class="px-2 py-1 text-xs rounded-full"
                >
                  {{ ad.adType }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">{{ ad.advertiser }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ ad.publishPeriod }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  :class="{
                    'bg-green-100 text-green-800': ad.status === '进行中',
                    'bg-blue-100 text-blue-800': ad.status === '待投放',
                    'bg-gray-100 text-gray-800': ad.status === '已结束'
                  }" 
                  class="px-2 py-1 text-xs rounded-full"
                >
                  {{ ad.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <button 
                  @click="viewAdDetails(ad)" 
                  class="text-blue-600 hover:text-blue-900 mr-3"
                >
                  查看
                </button>
                <button 
                  v-if="ad.status !== '已结束'"
                  @click="editAd(ad)" 
                  class="text-green-600 hover:text-green-900 mr-3"
                >
                  编辑
                </button>
                <button 
                  v-if="ad.status === '进行中'"
                  @click="pauseAd(ad)" 
                  class="text-orange-600 hover:text-orange-900 mr-3"
                >
                  暂停
                </button>
                <button 
                  v-if="ad.status === '待投放'"
                  @click="startAd(ad)" 
                  class="text-green-600 hover:text-green-900 mr-3"
                >
                  开始
                </button>
                <button 
                  @click="deleteAd(ad)" 
                  class="text-red-600 hover:text-red-900"
                >
                  删除
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- 分页 -->
      <div class="flex justify-between items-center mt-6">
        <div class="text-sm text-gray-500">
          显示 {{ filteredAds.length }} 条，共 {{ ads.length }} 条
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
    
    <!-- 广告数据统计 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">总广告数</p>
            <p class="text-2xl font-semibold">{{ ads.length }}</p>
          </div>
          <div class="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <LayoutDashboard class="h-6 w-6" />
          </div>
        </div>
        <div class="mt-4 flex items-center text-sm">
          <ArrowUp class="h-4 w-4 text-green-500 mr-1" />
          <span class="text-green-500">5%</span>
          <span class="text-gray-500 ml-2">较上月</span>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">进行中广告</p>
            <p class="text-2xl font-semibold">{{ ads.filter(ad => ad.status === '进行中').length }}</p>
          </div>
          <div class="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
            <Play class="h-6 w-6" />
          </div>
        </div>
        <div class="mt-4 flex items-center text-sm">
          <ArrowUp class="h-4 w-4 text-green-500 mr-1" />
          <span class="text-green-500">8%</span>
          <span class="text-gray-500 ml-2">较上月</span>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">待投放广告</p>
            <p class="text-2xl font-semibold">{{ ads.filter(ad => ad.status === '待投放').length }}</p>
          </div>
          <div class="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <Clock class="h-6 w-6" />
          </div>
        </div>
        <div class="mt-4 flex items-center text-sm">
          <ArrowDown class="h-4 w-4 text-red-500 mr-1" />
          <span class="text-red-500">3%</span>
          <span class="text-gray-500 ml-2">较上月</span>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">已结束广告</p>
            <p class="text-2xl font-semibold">{{ ads.filter(ad => ad.status === '已结束').length }}</p>
          </div>
          <div class="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
            <CheckCircle class="h-6 w-6" />
          </div>
        </div>
        <div class="mt-4 flex items-center text-sm">
          <ArrowUp class="h-4 w-4 text-green-500 mr-1" />
          <span class="text-green-500">12%</span>
          <span class="text-gray-500 ml-2">较上月</span>
        </div>
      </div>
    </div>
    
    <!-- 广告详情弹窗 -->
    <div v-if="showAdDetailsModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-lg font-semibold">广告详情</h3>
          <button @click="showAdDetailsModal = false" class="text-gray-500 hover:text-gray-700">
            <X class="h-5 w-5" />
          </button>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 class="font-medium mb-4">基本信息</h4>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-gray-500">广告名称</p>
                <p class="font-medium">{{ currentAd.adName }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">广告类型</p>
                <p class="font-medium">{{ currentAd.adType }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">广告主</p>
                <p class="font-medium">{{ currentAd.advertiser }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">公司名称</p>
                <p class="font-medium">{{ currentAd.companyName }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">投放时间</p>
                <p class="font-medium">{{ currentAd.publishPeriod }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">状态</p>
                <p class="font-medium">{{ currentAd.status }}</p>
              </div>
            </div>
          </div>
          
          <div v-if="currentAd.adType === '软广'">
            <h4 class="font-medium mb-4">软广详情</h4>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-gray-500">发布平台</p>
                <p class="font-medium">{{ currentAd.platform }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">发布账号</p>
                <p class="font-medium">{{ currentAd.publishAccount }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">计费方式</p>
                <p class="font-medium">{{ currentAd.billingMethod }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">费用</p>
                <p class="font-medium">{{ currentAd.cost }}元</p>
              </div>
            </div>
            <div class="mt-4">
              <p class="text-sm text-gray-500">软文主题</p>
              <p class="font-medium">{{ currentAd.theme }}</p>
            </div>
            <div class="mt-4">
              <p class="text-sm text-gray-500">关键词</p>
              <p class="font-medium">{{ currentAd.keywords }}</p>
            </div>
          </div>
          
          <div v-else>
            <h4 class="font-medium mb-4">硬广详情</h4>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-gray-500">广告位置</p>
                <p class="font-medium">{{ currentAd.position }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">广告尺寸</p>
                <p class="font-medium">{{ currentAd.size }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">计费方式</p>
                <p class="font-medium">{{ currentAd.billingMethod }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">费用</p>
                <p class="font-medium">{{ currentAd.cost }}元</p>
              </div>
            </div>
            <div class="mt-4">
              <p class="text-sm text-gray-500">广告文案</p>
              <p class="font-medium">{{ currentAd.copywriting }}</p>
            </div>
          </div>
        </div>
        
        <div class="mb-6">
          <h4 class="font-medium mb-4">广告素材预览</h4>
          <div class="border rounded-md p-4 bg-gray-50 h-64 flex items-center justify-center">
            <Image class="h-12 w-12 text-gray-400" />
            <p class="ml-2 text-gray-500">广告素材预览区域</p>
          </div>
        </div>
        
        <div class="mb-6">
          <h4 class="font-medium mb-4">数据统计</h4>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="border rounded-md p-4">
              <p class="text-sm text-gray-500">展示次数</p>
              <p class="text-xl font-semibold">{{ currentAd.impressions || '0' }}</p>
            </div>
            <div class="border rounded-md p-4">
              <p class="text-sm text-gray-500">点击次数</p>
              <p class="text-xl font-semibold">{{ currentAd.clicks || '0' }}</p>
            </div>
            <div class="border rounded-md p-4">
              <p class="text-sm text-gray-500">点击率</p>
              <p class="text-xl font-semibold">{{ currentAd.ctr || '0%' }}</p>
            </div>
          </div>
        </div>
        
        <div class="flex justify-end space-x-3">
          <button 
            @click="showAdDetailsModal = false" 
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            关闭
          </button>
          <button 
            v-if="currentAd.status !== '已结束'"
            @click="editAd(currentAd)" 
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            编辑
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { 
  Search, 
  X, 
  Image, 
  LayoutDashboard, 
  Play, 
  Clock, 
  CheckCircle, 
  ArrowUp, 
  ArrowDown 
} from 'lucide-vue-next';

// 搜索和筛选
const searchQuery = ref('');
const typeFilter = ref('all');
const statusFilter = ref('all');
const currentPage = ref(1);
const itemsPerPage = 10;

// 广告数据
const ads = ref([
  {
    adName: '夏季新品推广',
    adType: '软广',
    advertiser: '张三',
    companyName: '时尚服饰有限公司',
    publishPeriod: '2023-07-01 至 2023-07-31',
    status: '进行中',
    platform: '小红书',
    publishAccount: 'fashion_style',
    billingMethod: '按阅读量',
    cost: '5000',
    theme: '夏季清凉穿搭指南',
    keywords: '夏季,清凉,穿搭,时尚',
    impressions: '15,243',
    clicks: '1,876',
    ctr: '12.3%'
  },
  {
    adName: '健康饮品推广',
    adType: '硬广',
    advertiser: '李四',
    companyName: '健康饮品有限公司',
    publishPeriod: '2023-07-01 至 2023-07-31',
    status: '进行中',
    position: '首页顶部',
    size: '728x90',
    billingMethod: 'CPM',
    cost: '8000',
    copywriting: '清凉一夏，健康饮品伴你度过炎炎夏日！',
    impressions: '25,678',
    clicks: '2,345',
    ctr: '9.1%'
  },
  {
    adName: '美妆产品推广',
    adType: '软广',
    advertiser: '王五',
    companyName: '美丽化妆品有限公司',
    publishPeriod: '2023-06-25 至 2023-07-25',
    status: '进行中',
    platform: '抖音',
    publishAccount: 'beauty_tips',
    billingMethod: '按互动量',
    cost: '6000',
    theme: '夏日妆容教程',
    keywords: '美妆,夏日,妆容,教程',
    impressions: '18,765',
    clicks: '2,134',
    ctr: '11.4%'
  },
  {
    adName: '电子产品促销',
    adType: '硬广',
    advertiser: '赵六',
    companyName: '科技电子有限公司',
    publishPeriod: '2023-08-01 至 2023-08-31',
    status: '待投放',
    position: '侧边栏',
    size: '300x250',
    billingMethod: 'CPC',
    cost: '10000',
    copywriting: '最新款电子产品，限时特惠！',
    impressions: '0',
    clicks: '0',
    ctr: '0%'
  },
  {
    adName: '旅游套餐推广',
    adType: '软广',
    advertiser: '孙七',
    companyName: '快乐旅行社',
    publishPeriod: '2023-06-15 至 2023-06-30',
    status: '已结束',
    platform: '小红书',
    publishAccount: 'travel_fun',
    billingMethod: '按发布次数',
    cost: '3000',
    theme: '夏日避暑胜地推荐',
    keywords: '旅游,避暑,胜地,夏日',
    impressions: '12,456',
    clicks: '1,567',
    ctr: '12.6%'
  }
]);

// 筛选后的广告列表
const filteredAds = computed(() => {
  let result = ads.value;
  
  // 类型筛选
  if (typeFilter.value !== 'all') {
    const typeMap = {
      'soft': '软广',
      'hard': '硬广'
    };
    result = result.filter(ad => ad.adType === typeMap[typeFilter.value]);
  }
  
  // 状态筛选
  if (statusFilter.value !== 'all') {
    const statusMap = {
      'active': '进行中',
      'scheduled': '待投放',
      'completed': '已结束'
    };
    result = result.filter(ad => ad.status === statusMap[statusFilter.value]);
  }
  
  // 搜索筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(ad => 
      ad.adName.toLowerCase().includes(query) || 
      ad.advertiser.toLowerCase().includes(query) ||
      ad.companyName.toLowerCase().includes(query)
    );
  }
  
  return result;
});

// 总页数
const totalPages = computed(() => {
  return Math.ceil(filteredAds.value.length / itemsPerPage);
});

// 广告详情弹窗
const showAdDetailsModal = ref(false);
const currentAd = ref({});

const viewAdDetails = (ad) => {
  currentAd.value = ad;
  showAdDetailsModal.value = true;
};

// 编辑广告
const editAd = (ad) => {
  alert(`编辑广告：${ad.adName}`);
  // 实际项目中这里会跳转到编辑页面或打开编辑弹窗
};

// 暂停广告
const pauseAd = (ad) => {
  if (confirm(`确定要暂停广告：${ad.adName}？`)) {
    const index = ads.value.findIndex(a => a.adName === ad.adName);
    if (index !== -1) {
      ads.value[index].status = '待投放';
    }
  }
};

// 开始广告
const startAd = (ad) => {
  if (confirm(`确定要开始投放广告：${ad.adName}？`)) {
    const index = ads.value.findIndex(a => a.adName === ad.adName);
    if (index !== -1) {
      ads.value[index].status = '进行中';
    }
  }
};

// 删除广告
const deleteAd = (ad) => {
  if (confirm(`确定要删除广告：${ad.adName}？此操作不可恢复。`)) {
    const index = ads.value.findIndex(a => a.adName === ad.adName);
    if (index !== -1) {
      ads.value.splice(index, 1);
    }
  }
};
</script>

