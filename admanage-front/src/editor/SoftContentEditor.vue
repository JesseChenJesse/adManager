<template>
<div>
  <div class="bg-white rounded-lg shadow-md p-6 mb-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-lg font-semibold">软文编辑</h2>
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
          <option value="pending">待编写</option>
          <option value="review">审核中</option>
          <option value="revision">需修改</option>
          <option value="completed">已完成</option>
        </select>
      </div>
    </div>
    
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">广告名称</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">广告主</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">平台</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">分配时间</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="(task, index) in filteredTasks" :key="index" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">{{ task.adName }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ task.advertiser }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ task.platform }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ task.assignedAt }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span 
                :class="{
                  'bg-yellow-100 text-yellow-800': task.status === '待编写',
                  'bg-blue-100 text-blue-800': task.status === '审核中',
                  'bg-orange-100 text-orange-800': task.status === '需修改',
                  'bg-green-100 text-green-800': task.status === '已完成'
                }" 
                class="px-2 py-1 text-xs rounded-full"
              >
                {{ task.status }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <button 
                v-if="task.status === '待编写' || task.status === '需修改'"
                @click="editContent(task)" 
                class="text-blue-600 hover:text-blue-900 mr-3"
              >
                {{ task.status === '待编写' ? '编写' : '修改' }}
              </button>
              <button 
                v-else
                @click="viewTask(task)" 
                class="text-blue-600 hover:text-blue-900"
              >
                查看
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- 分页 -->
    <div class="flex justify-between items-center mt-6">
      <div class="text-sm text-gray-500">
        显示 {{ filteredTasks.length }} 条，共 {{ editorTasks.length }} 条
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
  
  <!-- 编辑弹窗 -->
  <div v-if="showEditorModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-5xl max-h-[90vh] overflow-y-auto">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-lg font-semibold">{{ currentTask.status === '待编写' ? '编写软文' : '修改软文' }}</h3>
        <button @click="showEditorModal = false" class="text-gray-500 hover:text-gray-700">
          <X class="h-5 w-5" />
        </button>
      </div>
      
      <div class="mb-6">
        <h4 class="font-medium mb-4">广告信息</h4>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-md">
          <div>
            <p class="text-sm text-gray-500">广告名称</p>
            <p class="font-medium">{{ currentTask.adName }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">广告主</p>
            <p class="font-medium">{{ currentTask.advertiser }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">平台</p>
            <p class="font-medium">{{ currentTask.platform }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">主题</p>
            <p class="font-medium">{{ currentTask.theme }}</p>
          </div>
        </div>
      </div>
      
      <div v-if="currentTask.status === '需修改'" class="mb-6">
        <h4 class="font-medium mb-4">广告主反馈</h4>
        <div class="p-4 bg-orange-50 border border-orange-200 rounded-md text-orange-800">
          {{ currentTask.feedback }}
        </div>
      </div>
      
      <div class="mb-6">
        <div class="flex justify-between items-center mb-4">
          <h4 class="font-medium">软文内容</h4>
          <button 
            @click="generateWithAI" 
            class="px-3 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-sm flex items-center"
            :disabled="isGenerating"
          >
            <Sparkles v-if="!isGenerating" class="h-4 w-4 mr-1" />
            <Loader2 v-else class="animate-spin h-4 w-4 mr-1" />
            {{ isGenerating ? '生成中...' : 'AI生成内容' }}
          </button>
        </div>
        <textarea 
          v-model="contentText" 
          class="w-full p-4 border rounded-md h-96 font-mono text-sm" 
          placeholder="请编写软文内容或使用AI助手生成..."
        ></textarea>
      </div>
      
      <div class="flex justify-end space-x-3">
        <button 
          @click="showEditorModal = false" 
          class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          取消
        </button>
        <button 
          @click="submitContent" 
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          :disabled="!contentText.trim()"
        >
          提交
        </button>
      </div>
    </div>
  </div>
  
  <!-- 查看任务弹窗 -->
  <div v-if="showViewModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-lg font-semibold">软文详情</h3>
        <button @click="showViewModal = false" class="text-gray-500 hover:text-gray-700">
          <X class="h-5 w-5" />
        </button>
      </div>
      
      <div class="mb-6">
        <h4 class="font-medium mb-4">广告信息</h4>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-md">
          <div>
            <p class="text-sm text-gray-500">广告名称</p>
            <p class="font-medium">{{ currentTask.adName }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">广告主</p>
            <p class="font-medium">{{ currentTask.advertiser }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">平台</p>
            <p class="font-medium">{{ currentTask.platform }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">状态</p>
            <p class="font-medium">{{ currentTask.status }}</p>
          </div>
        </div>
      </div>
      
      <div class="mb-6">
        <h4 class="font-medium mb-4">软文内容</h4>
        <div class="border rounded-md p-6 bg-white whitespace-pre-line">
          {{ currentTask.content }}
        </div>
      </div>
      
      <div v-if="currentTask.feedback" class="mb-6">
        <h4 class="font-medium mb-4">广告主反馈</h4>
        <div class="p-4 bg-gray-50 border rounded-md">
          {{ currentTask.feedback }}
        </div>
      </div>
      
      <div class="flex justify-end">
        <button 
          @click="showViewModal = false" 
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
import { Search, X, Sparkles, Loader2 } from 'lucide-vue-next';

// 搜索和筛选
const searchQuery = ref('');
const statusFilter = ref('all');
const currentPage = ref(1);
const itemsPerPage = 10;

// 编辑任务数据
const editorTasks = ref([
{
  id: 1,
  adName: '夏季新品推广',
  advertiser: '张三 (时尚服饰有限公司)',
  platform: '小红书',
  theme: '夏季清凉穿搭指南',
  assignedAt: '2023-06-15 10:30',
  status: '审核中',
  content: `# 夏季清凉穿搭指南

炎炎夏日已经来临，如何在保持时尚的同时又能清爽舒适？时尚服饰有限公司带你探索今夏最IN的清凉穿搭！

## 轻薄面料，自然清凉

选择天然材质的面料是夏季的首选。亚麻、棉、真丝这些透气性好的面料能让你在夏日里保持干爽。时尚服饰有限公司今夏推出的亚麻系列，采用进口面料，轻薄透气，穿在身上仿佛没有重量，让你的夏日更加舒适。

## 宽松剪裁，自在随性

紧身的衣物会让夏天更加难熬。宽松的剪裁不仅能增加空气流通，还能打造随性慵懒的夏日风格。我们的宽松亚麻裤、A字裙、阔腿裤都是不错的选择，既遮肉显瘦又清凉舒适。

## 明亮色彩，点亮夏日

夏天就是要充满活力！明亮的颜色能够反射阳光，减少热量吸收。同时，鲜艳的色彩也能提升心情。时尚服饰有限公司的夏季新品以明黄、湖蓝、珊瑚粉等色彩为主，让你在夏日里成为最亮眼的风景。

## 实用配饰，完美细节

一顶宽檐草帽不仅能遮阳防晒，还能增添复古文艺气息；一副墨镜既能保护眼睛，又能提升整体造型档次；一条丝巾可以多种方式佩戴，为简约的夏装增添亮点。

现在购买时尚服饰有限公司夏季新品，全场8折优惠！更有精美配饰赠送，数量有限，先到先得！

#夏季穿搭 #清凉时尚 #亚麻清爽 #时尚单品`,
  feedback: ''
},
{
  id: 2,
  adName: '健康饮品推广',
  advertiser: '李四 (健康饮品有限公司)',
  platform: '微博',
  theme: '夏日健康饮品指南',
  assignedAt: '2023-06-14 14:20',
  status: '已完成',
  content: `夏日健康饮品指南：让你的夏天既清凉又健康！

炎炎夏日，一杯清凉饮品是必不可少的解暑良方。但市面上的饮料含糖量高、添加剂多，长期饮用对健康不利。今天，健康饮品有限公司带你了解如何选择真正健康的夏日饮品！

【纯天然果汁】
我们的鲜榨果汁采用当季水果现榨而成，不添加任何防腐剂和人工甜味剂。富含维生素和矿物质，既解渴又补充营养。推荐尝试：西瓜薄荷特饮、凤梨蓝莓混合汁。

【植物蛋白饮品】
相比动物蛋白，植物蛋白更易消化吸收，适合夏季饮用。我们的杏仁奶、燕麦奶富含优质蛋白质和不饱和脂肪酸，口感顺滑，营养丰富。

【草本茶饮】
传统草本植物泡制的茶饮，具有清热解暑的功效。薄荷茶、菊花茶、金银花茶都是夏季的理想选择。我们的花草茶系列采用有机种植的原料，无农药残留，安全健康。

【发酵饮品】
适量饮用发酵饮品有助于肠道健康。我们的手工酸奶、康普茶含有丰富的益生菌，帮助维护肠道菌群平衡，增强免疫力。

健康饮品有限公司所有产品均通过严格的质量检测，不含人工色素、防腐剂和高果糖玉米糖浆。我们相信，真正的健康饮品应该尊重原料本身的味道和营养。

现在关注我们的官方微博，即有机会获得夏季饮品礼盒一份！让我们一起度过健康清凉的夏天！

#健康饮品 #夏日解暑 #无添加饮料 #营养饮品`,
  feedback: '内容很好，已通过审核。'
},
{
  id: 3,
  adName: '旅游套餐推广',
  advertiser: '孙七 (快乐旅行社)',
  platform: '小红书',
  theme: '夏日避暑胜地推荐',
  assignedAt: '2023-06-13 16:45',
  status: '需修改',
  content: `【夏日避暑胜地推荐：远离酷暑，享受清凉】

夏日炎炎，你是否已经受够了城市的闷热？快乐旅行社精心为您挑选了几处避暑胜地，让您在这个夏天远离酷暑，享受清凉！

## 山间仙境：莫干山

被誉为"中国十大避暑胜地"之一的莫干山，夏季平均气温仅24℃。这里竹林环绕，空气清新，是都市人逃离酷暑的理想选择。我们的莫干山3日游包含特色竹屋住宿、竹筏漂流和农家美食体验，让您感受原汁原味的山居生活。

## 海岛天堂：普吉岛

想要蓝天碧海？普吉岛是您的不二之选！这座泰国最大的海岛拥有洁白的沙滩和清澈的海水。我们的普吉岛6日游包含五星级海景酒店、浮潜体验和泰式SPA，让您彻底放松身心。

## 高原明珠：香格里拉

平均海拔3000米的香格里拉，夏季凉爽宜人。这里有壮观的雪山、辽阔的草原和神秘的藏族文化。我们的香格里拉5日游包含松赞林寺参观、普达措国家公园徒步和藏族家访，带您领略"人间天堂"的独特魅力。

## 北国风光：漠河

想要体验"夏天穿棉袄"的奇妙感受？中国最北端的漠河是您的理想目的地。这里夏季平均气温仅20℃，还能欣赏到神奇的北极光。我们的漠河4日游包含北极村参观、黑龙江源头探秘和篝火晚会，让您度过一个"凉爽"的夏天。

现在预订任意避暑线路，即可享受8折优惠！还有机会获得价值1000元的旅行装备礼包！名额有限，预订从速！

快乐旅行社——让旅行更快乐！

#避暑胜地 #夏日旅行 #清凉一夏 #旅游优惠`,
  feedback: '内容中对普吉岛的描述不够准确，需要修改。另外，需要增加更多关于我们旅行社特色服务的内容。'
},
{
  id: 4,
  adName: '美妆产品推广',
  advertiser: '王五 (美丽化妆品有限公司)',
  platform: '抖音',
  theme: '夏日妆容教程',
  assignedAt: '2023-06-12 11:30',
  status: '已完成',
  content: `【夏日清透妆容教程：告别油光，持久清爽一整天】

夏天到了，你是否为脸上的油光和脱妆而烦恼？今天，美丽化妆品有限公司带来夏日清透妆容教程，教你打造持久清爽的夏日妆容！

## 第一步：做好皮肤打底

夏季皮肤出油增多，选择合适的护肤品至关重要。推荐使用美丽化妆品的控油保湿精华，它能平衡皮肤水油，为妆容打造持久清爽的基础。使用方法：洁面后取适量精华，轻拍至吸收。

## 第二步：选择轻薄底妆

夏季底妆首选轻薄透气的配方。美丽化妆品的水感轻透粉底液，质地如水般轻盈，能完美遮瑕的同时保持肌肤呼吸。使用方法：取一泵粉底液，用美妆蛋由内向外均匀推开。

## 第三步：局部遮瑕

对于需要额外遮瑕的部位，如黑眼圈、痘印等，可以使用我们的长效遮瑕膏进行局部遮瑕。它的防水配方能在夏季高温下依然坚挺。使用方法：取少量遮瑕膏，用指腹轻轻点按需要遮瑕的部位。

## 第四步：定妆控油

夏季妆容的持久关键在于定妆。美丽化妆品的控油定妆散粉，含有吸油微粒，能有效吸收多余油脂，保持妆容持久清爽。使用方法：用蜜粉刷蘸取适量散粉，轻扫全脸，重点加强T区。

## 第五步：打造清新眼妆

夏日眼妆以清新自然为主。推荐使用我们的防水眼线笔和纤长睫毛膏，即使在夏季也不会晕染。使用方法：沿睫毛根部画细眼线，然后刷上睫毛膏，打造自然纤长的睫毛。

## 第六步：点缀唇妆

夏季唇妆推荐选择轻薄水润的唇釉。美丽化妆品的水漾唇釉，质地轻盈不粘腻，多种夏日清新色调可选。使用方法：取适量唇釉从唇中心向唇边缘轻轻涂抹。

现在购买美丽化妆品夏季新品，即可享受全场8折优惠！更有精美化妆包赠送！

#夏日妆容 #控油持久 #清透底妆 #美妆教程`,
  feedback: ''
},
{
  id: 5,
  adName: '家居装饰推广',
  advertiser: '赵六 (舒适家居有限公司)',
  platform: '小红书',
  theme: '夏季家居装饰指南',
  assignedAt: '2023-06-18 09:15',
  status: '待编写',
  content: '',
  feedback: ''
}
]);

// 筛选后的任务列表
const filteredTasks = computed(() => {
let result = editorTasks.value;

// 状态筛选
if (statusFilter.value !== 'all') {
  const statusMap = {
    'pending': '待编写',
    'review': '审核中',
    'revision': '需修改',
    'completed': '已完成'
  };
  result = result.filter(task => task.status === statusMap[statusFilter.value]);
}

// 搜索筛选
if (searchQuery.value) {
  const query = searchQuery.value.toLowerCase();
  result = result.filter(task => 
    task.adName.toLowerCase().includes(query) || 
    task.advertiser.toLowerCase().includes(query)
  );
}

return result;
});

// 总页数
const totalPages = computed(() => {
return Math.ceil(filteredTasks.value.length / itemsPerPage);
});

// 编辑弹窗
const showEditorModal = ref(false);
const currentTask = ref({});
const contentText = ref('');
const isGenerating = ref(false);

// 查看任务弹窗
const showViewModal = ref(false);

// 编辑内容
const editContent = (task) => {
currentTask.value = task;
contentText.value = task.content;
showEditorModal.value = true;
};

// 查看任务
const viewTask = (task) => {
currentTask.value = task;
showViewModal.value = true;
};

// 使用AI生成内容
const generateWithAI = async () => {
isGenerating.value = true;

try {
  // 模拟AI生成过程
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // 根据不同主题生成不同内容
  let generatedContent = '';
  
  if (currentTask.value.theme.includes('家居')) {
    generatedContent = `# 夏季家居装饰指南：打造清凉舒适的居住空间

炎炎夏日，一个清凉舒适的家是每个人的向往。今天，舒适家居有限公司带您了解如何通过简单的装饰变化，让您的家在夏季更加宜居。

## 选择清爽的色调

夏季家居装饰首选浅色系，如白色、浅蓝色、薄荷绿等。这些颜色不仅视觉上给人清凉感，还能反射阳光，减少室内热量积累。舒适家居的夏季新品系列以北欧简约风格为主，大量使用浅色调，为您的家增添一丝清凉。

## 轻盈通透的窗帘

夏季窗帘应选择轻薄透气的材质，如亚麻、棉、薄纱等。这类窗帘既能适当遮挡阳光，又不会阻碍空气流通。我们的夏季窗帘系列采用高品质亚麻材质，手感柔软，透光性好，多种颜色可选，满足不同家居风格的需求。

## 清凉舒适的床品

夏季床品应选择吸汗透气的天然材质。舒适家居的夏季床品系列采用100%天然棉和亚麻材质，触感柔软，透气性好，能有效吸收汗液，保持床面干爽。我们的冰丝凉席和天丝空调被，更是夏

