<template>
  <div>
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-lg font-semibold">广告审核</h2>
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
        </div>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">广告名称</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">广告类型</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">广告主</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">提交时间</th>
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
              <td class="px-6 py-4 whitespace-nowrap">{{ ad.submitTime }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <button 
                  @click="reviewAd(ad)" 
                  class="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                >
                  审核
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- 分页 -->
      <div class="flex justify-between items-center mt-6">
        <div class="text-sm text-gray-500">
          显示 {{ filteredAds.length }} 条，共 {{ pendingAds.length }} 条
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
    
    <!-- 审核弹窗 -->
    <div v-if="showReviewModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-lg font-semibold">广告审核</h3>
          <button @click="showReviewModal = false" class="text-gray-500 hover:text-gray-700">
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
                <p class="text-sm text-gray-500">联系人</p>
                <p class="font-medium">{{ currentAd.contactPerson }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">联系方式</p>
                <p class="font-medium">{{ currentAd.contactInfo }}</p>
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
                <p class="text-sm text-gray-500">发布时间</p>
                <p class="font-medium">{{ currentAd.publishTime }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">发布账号</p>
                <p class="font-medium">{{ currentAd.publishAccount }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">计费方式</p>
                <p class="font-medium">{{ currentAd.billingMethod }}</p>
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
                <p class="text-sm text-gray-500">展示时间</p>
                <p class="font-medium">{{ currentAd.displayPeriod }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">计费方式</p>
                <p class="font-medium">{{ currentAd.billingMethod }}</p>
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
          <h4 class="font-medium mb-4">审核意见</h4>
          <textarea 
            v-model="reviewFeedback" 
            class="w-full p-3 border rounded-md h-32" 
            placeholder="请输入审核意见..."
          ></textarea>
        </div>
        
        <div class="flex justify-end space-x-3">
          <button 
            @click="submitReview('rejected')" 
            class="px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50"
          >
            拒绝
          </button>
          <button 
            @click="submitReview('revision')" 
            class="px-4 py-2 border border-orange-500 text-orange-500 rounded-md hover:bg-orange-50"
          >
            需修改
          </button>
          <button 
            @click="submitReview('approved')" 
            class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            通过
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Search, X, Image } from 'lucide-vue-next';

// 搜索和筛选
const searchQuery = ref('');
const typeFilter = ref('all');
const currentPage = ref(1);
const itemsPerPage = 10;

// 待审核广告数据
const pendingAds = ref([
  {
    adName: '夏季新品推广',
    adType: '软广',
    advertiser: '张三',
    companyName: '时尚服饰有限公司',
    contactPerson: '张三',
    contactInfo: '13800138000',
    submitTime: '2023-06-15 14:30',
    platform: '小红书',
    publishTime: '2023-07-01',
    publishAccount: 'fashion_style',
    billingMethod: '按阅读量',
    theme: '夏季清凉穿搭指南',
    keywords: '夏季,清凉,穿搭,时尚'
  },
  {
    adName: '健康饮品推广',
    adType: '硬广',
    advertiser: '李四',
    companyName: '健康饮品有限公司',
    contactPerson: '李四',
    contactInfo: '13900139000',
    submitTime: '2023-06-18 09:15',
    position: '首页顶部',
    size: '728x90',
    displayPeriod: '2023-07-01 至 2023-07-31',
    billingMethod: 'CPM',
    copywriting: '清凉一夏，健康饮品伴你度过炎炎夏日！'
  },
  {
    adName: '电子产品促销',
    adType: '硬广',
    advertiser: '赵六',
    companyName: '科技电子有限公司',
    contactPerson: '赵六',
    contactInfo: '13600136000',
    submitTime: '2023-06-12 16:45',
    position: '侧边栏',
    size: '300x250',
    displayPeriod: '2023-06-20 至 2023-07-20',
    billingMethod: 'CPC',
    copywriting: '最新款电子产品，限时特惠！'
  },
  {
    adName: '美妆产品推广',
    adType: '软广',
    advertiser: '王五',
    companyName: '美丽化妆品有限公司',
    contactPerson: '王五',
    contactInfo: '13700137000',
    submitTime: '2023-06-10 11:20',
    platform: '抖音',
    publishTime: '2023-06-25',
    publishAccount: 'beauty_tips',
    billingMethod: '按互动量',
    theme: '夏日妆容教程',
    keywords: '美妆,夏日,妆容,教程'
  }
]);

// 筛选后的广告列表
const filteredAds = computed(() => {
  let result = pendingAds.value;
  
  // 类型筛选
  if (typeFilter.value !== 'all') {
    const typeMap = {
      'soft': '软广',
      'hard': '硬广'
    };
    result = result.filter(ad => ad.adType === typeMap[typeFilter.value]);
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

// 审核弹窗
const showReviewModal = ref(false);
const currentAd = ref({});
const reviewFeedback = ref('');

const reviewAd = (ad) => {
  currentAd.value = ad;
  reviewFeedback.value = '';
  showReviewModal.value = true;
};

// 提交审核结果
const submitReview = (result) => {
  if (!reviewFeedback.value.trim() && (result === 'rejected' || result === 'revision')) {
    alert('请填写审核意见');
    return;
  }
  
  // 模拟API调用
  setTimeout(() => {
    // 从待审核列表中移除
    const index = pendingAds.value.findIndex(ad => ad.adName === currentAd.value.adName);
    if (index !== -1) {
      pendingAds.value.splice(index, 1);
    }
    
    // 关闭弹窗
    showReviewModal.value = false;
    
    // 显示结果
    const resultText = {
      'approved': '通过',
      'rejected': '拒绝',
      'revision': '需修改'
    };
    alert(`已${resultText[result]}广告：${currentAd.value.adName}`);
  }, 500);
};
</script>

