require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// 基础中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 添加请求日志中间件
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} [${req.method}] ${req.url}`);
  next();
});

// 静态文件目录
app.use('/uploads', express.static('uploads'));

// 加载路由
const adRoutes = require('./routes/adRoutes');
const authRoutes = require('./routes/authRoutes');

console.log('路由模块加载状态:');
console.log('- authRoutes:', Object.keys(authRoutes).length > 0 ? '已加载' : '加载失败');
console.log('- adRoutes:', Object.keys(adRoutes).length > 0 ? '已加载' : '加载失败');

// API路由
app.use('/api/v1/ads', adRoutes);
app.use('/api/v1/auth', authRoutes);

// 添加路由诊断端点
app.get('/api/debug/routes', (req, res) => {
  const routes = [];
  
  app._router.stack.forEach(middleware => {
    if(middleware.route) { // routes registered directly on the app
      routes.push({
        path: middleware.route.path,
        methods: Object.keys(middleware.route.methods)
      });
    } else if(middleware.name === 'router') { // router middleware
      middleware.handle.stack.forEach(handler => {
        if(handler.route) {
          const path = handler.route.path;
          const methods = Object.keys(handler.route.methods);
          routes.push({ path: middleware.regexp.toString() + path, methods });
        }
      });
    }
  });
  
  res.json(routes);
});

// 基础路由测试
app.get('/', (req, res) => {
  res.send('广告管理系统后端API');
});

// 全局错误处理
app.use((err, req, res, next) => {
  console.error('全局错误:', err.stack);
  res.status(500).json({
    success: false,
    message: '服务器错误'
  });
});

// 启动服务
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
  console.log(`API地址: http://localhost:${PORT}/api/v1`);
  console.log(`- Auth API: http://localhost:${PORT}/api/v1/auth`);
  console.log(`- Ads API: http://localhost:${PORT}/api/v1/ads`);
});
