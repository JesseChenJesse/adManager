<!--广告主仪表盘-->

<template>
  <div>
    <div v-if="!selectedType">
      <h2 class="text-2xl font-bold mb-8 text-gray-800">选择广告类型</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- 软广选项 -->
        <div 
          @click="selectType('soft')" 
          class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg p-8 border-2 border-transparent hover:border-blue-500 cursor-pointer transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl group"
        >
          <div class="flex items-center justify-center h-20 w-20 rounded-full bg-blue-500 text-white mb-6 mx-auto group-hover:bg-blue-600 transition-colors">
            <MessageSquare class="h-10 w-10" />
          </div>
          <h3 class="text-2xl font-bold text-center mb-4 text-blue-800">软广告</h3>
          <p class="text-gray-600 text-center mb-6">
            内容营销、软文推广、KOL合作等原生广告形式，提供更自然的用户体验
          </p>
          <div class="mt-4 text-center">
            <span class="inline-block px-6 py-2 bg-blue-500 text-white rounded-full text-sm font-medium shadow-md group-hover:bg-blue-600 transition-colors">
              选择软广
            </span>
          </div>
        </div>
        
        <!-- 硬广选项 -->
        <div 
          @click="selectType('hard')" 
          class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-lg p-8 border-2 border-transparent hover:border-purple-500 cursor-pointer transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl group"
        >
          <div class="flex items-center justify-center h-20 w-20 rounded-full bg-purple-500 text-white mb-6 mx-auto group-hover:bg-purple-600 transition-colors">
            <Image class="h-10 w-10" />
          </div>
          <h3 class="text-2xl font-bold text-center mb-4 text-purple-800">硬广告</h3>
          <p class="text-gray-600 text-center mb-6">
            Banner广告、弹窗广告、插页广告等传统展示广告，提供更高的曝光率
          </p>
          <div class="mt-4 text-center">
            <span class="inline-block px-6 py-2 bg-purple-500 text-white rounded-full text-sm font-medium shadow-md group-hover:bg-purple-600 transition-colors">
              选择硬广
            </span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 软广表单 -->
    <div v-else-if="selectedType === 'soft'" class="bg-white rounded-lg shadow-md p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-lg font-semibold">软广告申请表</h2>
        <button @click="selectedType = null" class="text-gray-500 hover:text-gray-700">
          <ArrowLeft class="h-5 w-5" />
          返回
        </button>
      </div>
      
      <form @submit.prevent="submitForm">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">公司名称</label>
            <input v-model="softAdForm.companyName" type="text" class="w-full p-2 border rounded-md" required>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">联系人</label>
            <input v-model="softAdForm.contactPerson" type="text" class="w-full p-2 border rounded-md" required>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">联系方式</label>
            <input v-model="softAdForm.contactInfo" type="text" class="w-full p-2 border rounded-md" required>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">广告名称</label>
            <input v-model="softAdForm.adName" type="text" class="w-full p-2 border rounded-md" required>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">发布平台</label>
            <select v-model="softAdForm.platform" class="w-full p-2 border rounded-md" required>
              <option value="xhs">小红书</option>
              <option value="dy">抖音</option>
              <option value="wb">微博</option>
              <option value="other">其他</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">发布时间</label>
            <input v-model="softAdForm.publishTime" type="date" class="w-full p-2 border rounded-md" required>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">发布账号</label>
            <input v-model="softAdForm.publishAccount" type="text" class="w-full p-2 border rounded-md" required>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">计费方式</label>
            <select v-model="softAdForm.billingMethod" class="w-full p-2 border rounded-md" required>
              <option value="publish">按发布次数</option>
              <option value="read">按阅读量</option>
              <option value="interaction">按互动量</option>
            </select>
          </div>
        </div>
        
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-1">软文主题</label>
          <input v-model="softAdForm.theme" type="text" class="w-full p-2 border rounded-md" required>
        </div>
        
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-1">软文风格</label>
          <select v-model="softAdForm.style" class="w-full p-2 border rounded-md" required>
            <option value="informative">信息型</option>
            <option value="storytelling">故事型</option>
            <option value="humorous">幽默型</option>
            <option value="emotional">情感型</option>
          </select>
        </div>
        
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-1">关键词（用逗号分隔）</label>
          <input v-model="softAdForm.keywords" type="text" class="w-full p-2 border rounded-md" required>
        </div>
        
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-1">链接</label>
          <input v-model="softAdForm.link" type="url" class="w-full p-2 border rounded-md" required>
        </div>
        
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-1">广告费用（元）</label>
          <input v-model="softAdForm.cost" type="number" class="w-full p-2 border rounded-md" required>
        </div>
        
        <!-- <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-1">上传图片/视频</label>
          <div class="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
            <Upload class="h-8 w-8 mx-auto text-gray-400" />
            <p class="mt-2 text-sm text-gray-500">点击或拖拽文件到此处上传</p>
            <p class="mt-1 text-xs text-gray-400">支持 JPG, PNG, MP4 格式</p>
            <input type="file" class="hidden" multiple>
          </div>
        </div> -->
        
        <div class="flex justify-end">
          <button 
            type="button" 
            @click="selectedType = null" 
            class="mr-4 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            取消
          </button>
          <button 
            type="submit" 
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            提交申请
          </button>
        </div>
      </form>
    </div> 
    
    <!-- 硬广表单 -->
    <div v-else-if="selectedType === 'hard'" class="bg-white rounded-lg shadow-md p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-lg font-semibold">硬广告申请表</h2>
        <button @click="selectedType = null" class="text-gray-500 hover:text-gray-700">
          <ArrowLeft class="h-5 w-5" />
          返回
        </button>
      </div>
      
      <form @submit.prevent="submitForm">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">公司名称</label>
            <input v-model="hardAdForm.companyName" type="text" class="w-full p-2 border rounded-md" required>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">联系人</label>
            <input v-model="hardAdForm.contactPerson" type="text" class="w-full p-2 border rounded-md" required>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">联系方式</label>
            <input v-model="hardAdForm.contactInfo" type="text" class="w-full p-2 border rounded-md" required>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">广告名称</label>
            <input v-model="hardAdForm.adName" type="text" class="w-full p-2 border rounded-md" required>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">广告展示位置</label>
            <select v-model="hardAdForm.position" class="w-full p-2 border rounded-md" required>
              <option value="top">首页顶部</option>
              <option value="sidebar">侧边栏</option>
              <option value="banner">Banner</option>
              <option value="popup">弹窗</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">广告展示时间</label>
            <div class="grid grid-cols-2 gap-2">
              <input v-model="hardAdForm.startDate" type="date" class="w-full p-2 border rounded-md" required>
              <input v-model="hardAdForm.endDate" type="date" class="w-full p-2 border rounded-md" required>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">广告尺寸</label>
            <select v-model="hardAdForm.size" class="w-full p-2 border rounded-md" required>
              <option value="728x90">728x90 - 横幅</option>
              <option value="300x250">300x250 - 中长方形</option>
              <option value="300x600">300x600 - 大长方形</option>
              <option value="320x50">320x50 - 移动横幅</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">计费方式</label>
            <select v-model="hardAdForm.billingMethod" class="w-full p-2 border rounded-md" required>
              <option value="cpm">CPM (按展示次数)</option>
              <option value="cpc">CPC (按点击次数)</option>
              <option value="cpa">CPA (按行动次数)</option>
            </select>
          </div>
        </div>
        
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-1">广告链接</label>
          <input v-model="hardAdForm.link" type="url" class="w-full p-2 border rounded-md" required>
        </div>
        
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-1">广告文案</label>
          <textarea v-model="hardAdForm.copywriting" class="w-full p-2 border rounded-md h-24" required></textarea>
        </div>
        
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-1">广告费用（元）</label>
          <input v-model="hardAdForm.cost" type="number" class="w-full p-2 border rounded-md" required>
        </div>
        
        <!-- <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-1">上传广告图片</label>
          <div class="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
            <Upload class="h-8 w-8 mx-auto text-gray-400" />
            <p class="mt-2 text-sm text-gray-500">点击或拖拽文件到此处上传</p>
            <p class="mt-1 text-xs text-gray-400">支持 JPG, PNG 格式</p>
            <input type="file" class="hidden">
          </div>
        </div> -->
        
        <div class="flex justify-end">
          <button 
            type="button" 
            @click="selectedType = null" 
            class="mr-4 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            取消
          </button>
          <button 
            type="submit" 
            class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            提交申请
          </button>
        </div>
      </form>
    </div> 
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { MessageSquare, Image, ArrowLeft, Upload } from 'lucide-vue-next';

const selectedType = ref(null);

// 软广表单数据
const softAdForm = ref({
  companyName: '',
  contactPerson: '',
  contactInfo: '',
  adName: '',
  platform: 'xhs',
  publishTime: '',
  publishAccount: '',
  theme: '',
  style: 'informative',
  keywords: '',
  link: '',
  cost: '',
  billingMethod: 'publish'
});

// 硬广表单数据
const hardAdForm = ref({
  companyName: '',
  contactPerson: '',
  contactInfo: '',
  adName: '',
  position: 'top',
  startDate: '',
  endDate: '',
  size: '728x90',
  link: '',
  copywriting: '',
  cost: '',
  billingMethod: 'cpm'
});

// 提交表单
const submitForm = async () => {
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    alert('申请提交成功！');
    selectedType.value = null;
    
    // 重置表单
    if (selectedType.value === 'soft') {
      Object.keys(softAdForm.value).forEach(key => {
        softAdForm.value[key] = '';
      });
      softAdForm.value.platform = 'xhs';
      softAdForm.value.style = 'informative';
      softAdForm.value.billingMethod = 'publish';
    } else {
      Object.keys(hardAdForm.value).forEach(key => {
        hardAdForm.value[key] = '';
      });
      hardAdForm.value.position = 'top';
      hardAdForm.value.size = '728x90';
      hardAdForm.value.billingMethod = 'cpm';
    }
  } catch (error) {
    alert('提交失败，请稍后重试');
  }
};

const selectType = (type) => {
  selectedType.value = type;
};
</script>

