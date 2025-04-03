
const cors = require('cors');

// 更新app.js中的CORS配置
const corsOptions = {
    origin: process.env.NODE_ENV === 'production'
        ? 'https://your-production-frontend-url.com'
        : 'http://localhost:8080',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));


