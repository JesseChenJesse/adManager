const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 验证JWT令牌
const verifyToken = async (req, res, next) => {
  try {
    // 从请求头获取令牌
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: '未提供访问令牌' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: '未提供访问令牌' });
    }

    // 验证令牌
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 查找用户
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: '用户不存在' });
    }

    // 将用户信息附加到请求对象
    req.user = user;
    next();
  } catch (error) {
    console.error('认证错误:', error);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: '令牌已过期' });
    }
    return res.status(401).json({ message: '认证失败' });
  }
};

// 检查用户是否具有特定角色
const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: '未认证' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: '没有权限执行此操作' });
    }

    next();
  };
};

module.exports = {
  verifyToken,
  checkRole
};