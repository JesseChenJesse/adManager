<template>
  <div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- 输入区域 -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-lg font-semibold mb-6">AI文案生成助手</h2>
        
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">文案类型</label>
          <select v-model="copyType" class="w-full p-2 border rounded-md">
            <option value="product">产品介绍</option>
            <option value="brand">品牌故事</option>
            <option value="promotion">促销活动</option>
            <option value="social">社交媒体</option>
          </select>
        </div>
        
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">行业</label>
          <select v-model="industry" class="w-full p-2 border rounded-md">
            <option value="fashion">时尚服饰</option>
            <option value="beauty">美妆护肤</option>
            <option value="food">食品饮料</option>
            <option value="tech">科技电子</option>
            <option value="travel">旅游出行</option>
            <option value="health">健康医疗</option>
          </select>
        </div>
        
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">目标平台</label>
          <select v-model="platform" class="w-full p-2 border rounded-md">
            <option value="xhs">小红书</option>
            <option value="dy">抖音</option>
            <option value="wb">微博</option>
            <option value="wx">微信</option>
          </select>
        </div>
        
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">文案风格</label>
          <select v-model="style" class="w-full p-2 border rounded-md">
            <option value="professional">专业正式</option>
            <option value="casual">轻松随意</option>
            <option value="humorous">幽默风趣</option>
            <option value="emotional">情感共鸣</option>
            <option value="storytelling">故事叙述</option>
          </select>
        </div>
        
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">关键词（用逗号分隔）</label>
          <input v-model="keywords" type="text" class="w-full p-2 border rounded-md" placeholder="例如：时尚,夏季,清凉,穿搭">
        </div>
        
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-1">产品/服务描述</label>
          <textarea 
            v-model="description" 
            class="w-full p-2 border rounded-md h-32" 
            placeholder="请详细描述您的产品或服务..."
          ></textarea>
        </div>
        
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">文案长度</label>
          <div class="flex items-center space-x-4">
            <label class="inline-flex items-center">
              <input type="radio" v-model="length" value="short" class="form-radio text-blue-600">
              <span class="ml-2">短文案 (100字以内)</span>
            </label>
            <label class="inline-flex items-center">
              <input type="radio" v-model="length" value="medium" class="form-radio text-blue-600">
              <span class="ml-2">中等 (300字左右)</span>
            </label>
            <label class="inline-flex items-center">
              <input type="radio" v-model="length" value="long" class="form-radio text-blue-600">
              <span class="ml-2">长文案 (500字以上)</span>
            </label>
          </div>
        </div>
        
        <button 
          @click="generateCopy" 
          class="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center"
          :disabled="isGenerating"
        >
          <Loader2 v-if="isGenerating" class="animate-spin h-5 w-5 mr-2" />
          {{ isGenerating ? '生成中...' : '生成文案' }}
        </button>
      </div>
      
      <!-- 输出区域 -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-lg font-semibold">生成结果</h2>
          <div class="flex space-x-2">
            <button 
              v-if="generatedCopy" 
              @click="regenerateCopy" 
              class="px-3 py-1 border rounded-md hover:bg-gray-50 text-sm flex items-center"
              :disabled="isGenerating"
            >
              <RefreshCw class="h-4 w-4 mr-1" />
              重新生成
            </button>
            <button 
              v-if="generatedCopy" 
              @click="copyCopyToClipboard" 
              class="px-3 py-1 border rounded-md hover:bg-gray-50 text-sm flex items-center"
            >
              <Copy class="h-4 w-4 mr-1" />
              复制
            </button>
          </div>
        </div>
        
        <div 
          v-if="generatedCopy" 
          class="border rounded-md p-4 h-[500px] overflow-y-auto whitespace-pre-line"
        >
          {{ generatedCopy }}
        </div>
        
        <div 
          v-else 
          class="border rounded-md p-4 h-[500px] flex flex-col items-center justify-center text-gray-500"
        >
          <MessageSquare class="h-12 w-12 mb-4" />
          <p class="text-center">填写左侧表单并点击"生成文案"按钮<br>AI将为您生成专业的广告文案</p>
        </div>
        
        <div v-if="generatedCopy" class="mt-6">
          <h3 class="font-medium mb-2">保存为模板</h3>
          <div class="flex space-x-2">
            <input 
              v-model="templateName" 
              type="text" 
              class="flex-1 p-2 border rounded-md" 
              placeholder="输入模板名称"
            >
            <button 
              @click="saveAsTemplate" 
              class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              保存
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 模板列表 -->
    <div class="mt-6 bg-white rounded-lg shadow-md p-6">
      <h2 class="text-lg font-semibold mb-6">已保存的模板</h2>
      
      <div v-if="templates.length === 0" class="text-center py-8 text-gray-500">
        <Save class="h-12 w-12 mx-auto mb-4" />
        <p>暂无保存的模板</p>
      </div>
      
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div 
          v-for="(template, index) in templates" 
          :key="index" 
          class="border rounded-md p-4 hover:shadow-md transition-shadow"
        >
          <div class="flex justify-between items-start mb-2">
            <h3 class="font-medium">{{ template.name }}</h3>
            <div class="flex space-x-1">
              <button @click="loadTemplate(template)" class="text-blue-600 hover:text-blue-800">
                <FileText class="h-4 w-4" />
              </button>
              <button @click="deleteTemplate(index)" class="text-red-600 hover:text-red-800">
                <Trash2 class="h-4 w-4" />
              </button>
            </div>
          </div>
          <p class="text-sm text-gray-500 mb-2">
            {{ template.type }} | {{ template.industry }} | {{ template.platform }}
          </p>
          <p class="text-sm line-clamp-3">{{ template.content.substring(0, 100) }}...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { 
  MessageSquare, 
  RefreshCw, 
  Copy, 
  Save, 
  FileText, 
  Trash2, 
  Loader2 
} from 'lucide-vue-next';

// 表单数据
const copyType = ref('product');
const industry = ref('fashion');
const platform = ref('xhs');
const style = ref('casual');
const keywords = ref('');
const description = ref('');
const length = ref('medium');

// 生成结果
const generatedCopy = ref('');
const isGenerating = ref(false);
const templateName = ref('');

// 模板列表
const templates = ref([
  {
    name: '夏季服装促销',
    type: '促销活动',
    industry: '时尚服饰',
    platform: '小红书',
    content: '【夏日清凉特惠】炎炎夏日，你的衣橱准备好了吗？\n\n现在购买我们的夏季新品系列，即可享受全场8折优惠！轻薄透气的面料，简约时尚的设计，让你在这个夏天既清凉又时尚。\n\n特别推荐：\n✨ 冰丝防晒衫：阻隔99%紫外线，轻薄如羽\n✨ 宽松亚麻裤：自然材质，透气舒适\n✨ 印花连衣裙：明亮色彩，点亮整个夏天\n\n活动时间：6月1日-6月15日\n限时优惠，先到先得！\n\n#夏季穿搭 #清凉特惠 #时尚单品'
  }
]);

// 生成文案
const generateCopy = async () => {
  if (!description.value.trim()) {
    alert('请填写产品/服务描述');
    return;
  }
  
  isGenerating.value = true;
  
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 根据不同类型生成不同的示例文案
    const typeMap = {
      'product': generateProductCopy,
      'brand': generateBrandCopy,
      'promotion': generatePromotionCopy,
      'social': generateSocialCopy
    };
    
    generatedCopy.value = typeMap[copyType.value]();
  } catch (error) {
    alert('生成失败，请稍后重试');
  } finally {
    isGenerating.value = false;
  }
};

// 产品介绍文案
const generateProductCopy = () => {
  const industryPrefix = {
    'fashion': '时尚',
    'beauty': '美丽',
    'food': '美味',
    'tech': '科技',
    'travel': '旅行',
    'health': '健康'
  }[industry.value];
  
  const styleText = {
    'professional': '专业正式',
    'casual': '轻松随意',
    'humorous': '幽默风趣',
    'emotional': '情感共鸣',
    'storytelling': '故事叙述'
  }[style.value];
  
  const keywordsList = keywords.value ? keywords.value.split(',') : [];
  const keywordsText = keywordsList.map(k => `#${k.trim()}`).join(' ');
  
  return `【${industryPrefix}新品推荐】

${description.value}

${length.value === 'short' ? '简短介绍：' : length.value === 'medium' ? '产品特点：' : '详细介绍：'}
✨ 优质材料，精心打造
✨ 独特设计，彰显个性
✨ 舒适体验，品质保证

${platform.value === 'xhs' ? '小红书独家首发' : platform.value === 'dy' ? '抖音限时特惠' : platform.value === 'wb' ? '微博粉丝专享' : '微信会员优先'}

${keywordsText}`;
};

// 品牌故事文案
const generateBrandCopy = () => {
  return `【品牌故事】

${description.value}

我们的品牌理念：
✨ 专注品质，追求卓越
✨ 创新设计，引领潮流
✨ 用心服务，顾客至上

多年来，我们始终坚持初心，为消费者提供最优质的产品和服务。每一件产品都凝聚了我们的匠心和热爱，希望能为您的生活增添一份美好。

#品牌故事 #匠心之作 ${keywords.value ? keywords.value.split(',').map(k => `#${k.trim()}`).join(' ') : ''}`;
};

// 促销活动文案
const generatePromotionCopy = () => {
  return `【限时特惠】

${description.value}

活动详情：
✨ 全场商品8折起
✨ 满300减50，满500减100
✨ 新用户首单立减30元

活动时间：6月1日-6月15日
先到先得，错过再等一年！

#限时特惠 #折扣活动 ${keywords.value ? keywords.value.split(',').map(k => `#${k.trim()}`).join(' ') : ''}`;
};

// 社交媒体文案
const generateSocialCopy = () => {
  const platformText = {
    'xhs': '小红书',
    'dy': '抖音',
    'wb': '微博',
    'wx': '微信'
  }[platform.value];
  
  return `【${platformText}爆款推荐】

${description.value}

为什么它会成为爆款：
✨ 独特创新，引领潮流
✨ 实用性强，解决痛点
✨ 性价比高，物超所值

已有上千位达人推荐，用户好评如潮！
快来和我们一起体验吧！

#爆款推荐 #达人同款 ${keywords.value ? keywords.value.split(',').map(k => `#${k.trim()}`).join(' ') : ''}`;
};

// 重新生成
const regenerateCopy = () => {
  generateCopy();
};

// 复制到剪贴板
const copyCopyToClipboard = () => {
  navigator.clipboard.writeText(generatedCopy.value)
    .then(() => {
      alert('已复制到剪贴板');
    })
    .catch(() => {
      alert('复制失败，请手动复制');
    });
};

// 保存为模板
const saveAsTemplate = () => {
  if (!templateName.value.trim()) {
    alert('请输入模板名称');
    return;
  }
  
  const typeMap = {
    'product': '产品介绍',
    'brand': '品牌故事',
    'promotion': '促销活动',
    'social': '社交媒体'
  };
  
  const industryMap = {
    'fashion': '时尚服饰',
    'beauty': '美妆护肤',
    'food': '食品饮料',
    'tech': '科技电子',
    'travel': '旅游出行',
    'health': '健康医疗'
  };
  
  const platformMap = {
    'xhs': '小红书',
    'dy': '抖音',
    'wb': '微博',
    'wx': '微信'
  };
  
  templates.value.push({
    name: templateName.value,
    type: typeMap[copyType.value],
    industry: industryMap[industry.value],
    platform: platformMap[platform.value],
    content: generatedCopy.value
  });
  
  templateName.value = '';
  alert('模板保存成功');
};

// 加载模板
const loadTemplate = (template) => {
  generatedCopy.value = template.content;
};

// 删除模板
const deleteTemplate = (index) => {
  if (confirm('确定要删除此模板吗？')) {
    templates.value.splice(index, 1);
  }
};
</script>

