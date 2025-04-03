const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middlewares/auth');

// 用户注册
router.post('/register', authController.register);

// 用户登录
router.post('/login', authController.login);

// 获取当前用户信息
router.get('/me', verifyToken, authController.getCurrentUser);

// 获取用户通知
router.get('/notifications', verifyToken, authController.getUserNotifications);

// 标记通知为已读
router.put('/notifications/:id', verifyToken, authController.markNotificationRead);

module.exports = router; 