const User = require('../models/User');
const jwt = require('jsonwebtoken');

// 用户注册
exports.register = async (req, res) => {
  try {
    console.log('收到注册请求:', req.body);
    const { username, password, email, company, phone } = req.body;
    
    // 验证必填字段
    if (!username || !password || !email) {
      console.log('缺少必填字段');
      return res.status(400).json({
        success: false,
        message: '用户名、密码和邮箱为必填项'
      });
    }
    
    // 检查用户名是否已存在
    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      console.log('用户名已存在:', username);
      return res.status(400).json({
        success: false,
        message: '用户名已存在'
      });
    }
    
    // 创建新用户
    const userData = {
      username,
      password,
      email,
      company,
      phone,
      role: '广告主' // 设置角色为广告主，注意这里使用中文
    };
    
    console.log('准备创建用户:', { ...userData, password: '******' });
    
    try {
      const newUser = await User.create(userData); // 将用户数据写入数据库
      console.log('用户创建成功:', newUser.id);
      
      // 生成 JWT
      const token = jwt.sign(
        { id: newUser.id, username: newUser.username, role: newUser.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES }
      );
      
      // 返回用户信息（不包含密码）
      const userWithoutPassword = { ...newUser };
      delete userWithoutPassword.password;
      
      res.status(201).json({
        success: true,
        token,
        user: userWithoutPassword
      });
    } catch (dbError) {
      console.error('数据库操作失败:', dbError);
      return res.status(500).json({
        success: false,
        message: '数据库操作失败，请检查数据格式或联系管理员',
        error: dbError.message
      });
    }
  } catch (error) {
    console.error('注册失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误，注册失败',
      error: error.message
    });
  }
};

// 用户登录
exports.login = async (req, res) => {
  try {
    console.log("登录请求:", req.body);
    const { username, password } = req.body;
    
    // 查询用户
    const user = await User.findByUsername(username);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: '用户名或密码错误'
      });
    }

    // 验证密码
    let isValidPassword = await User.verifyPassword(password, user.password);
    console.log('密码验证结果:', isValidPassword, '输入密码长度:', password.length, '数据库密码类型:', typeof user.password);
    
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: '用户名或密码错误'
      });
    }

    console.log("登录成功，用户角色:", user.role);

    // 生成token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES }
    );

    // 更新最后登录时间
    await User.updateLastLogin(user.id);

    // 根据角色返回不同的重定向路径
    let redirectPath;
    if (user.role === '广告主') {
      redirectPath = '/advertiser/ad-application';
    } else if (user.role === '管理员') {
      redirectPath = '/admin/ad-management';
    } else {
      redirectPath = '/advertiser/ad-application'; // 默认路径
    }

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        company: user.company,
        email: user.email,
        redirectPath // 返回重定向路径
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: '登录失败，请稍后重试'
    });
  }
};

// 获取当前用户信息
exports.getCurrentUser = async (req, res) => {
  try {
    const { password, ...userWithoutPassword } = req.user;
    
    // 获取未读通知数量
    const notifications = await User.getNotifications(req.user.id, false);
    
    res.json({
      success: true,
      data: {
        ...userWithoutPassword,
        unread_notifications: notifications.length
      }
    });
  } catch (error) {
    console.error('获取用户信息失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误，获取用户信息失败'
    });
  }
};

// 获取用户通知
exports.getUserNotifications = async (req, res) => {
  try {
    const { is_read } = req.query;
    const isRead = is_read === 'true' ? 1 : (is_read === 'false' ? 0 : null);
    
    const notifications = await User.getNotifications(req.user.id, isRead);

    // 适配新的字段名称
    const formattedNotifications = notifications.map(notice => ({
      id: notice.id,
      user_id: notice.user_id,
      type: notice.type,
      title: notice.title,
      content: notice.message, // 注意: 新表结构中是message字段
      is_read: notice.is_read,
      link: notice.link,
      created_at: notice.created_at,
      read_at: notice.read_at
    }));
    
    res.json({
      success: true,
      data: formattedNotifications
    });
  } catch (error) {
    console.error('获取通知失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误，获取通知失败'
    });
  }
};

// 标记通知为已读
exports.markNotificationRead = async (req, res) => {
  try {
    const notificationId = req.params.id;
    const success = await User.markNotificationRead(notificationId);
    
    if (!success) {
      return res.status(404).json({
        success: false,
        message: '通知不存在'
      });
    }
    
    res.json({
      success: true,
      message: '通知已标记为已读'
    });
  } catch (error) {
    console.error('标记通知失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误，标记通知失败'
    });
  }
};
