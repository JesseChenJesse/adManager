// scripts/init-db.js
const bcrypt = require('bcryptjs');
const { sequelize, User, syncDatabase } = require('../models');

const initDatabase = async () => {
    try {
        // 同步数据库结构
        await syncDatabase();

        // 检查是否已有用户
        const userCount = await User.count();
        if (userCount > 0) {
            console.log('数据库已初始化，跳过添加测试用户');
            return;
        }

        // 创建测试用户
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        await User.bulkCreate([
            {
                username: 'admin',
                password: hashedPassword,
                role: 'admin',
                company: '系统管理部门',
                email: 'admin@example.com',
                phone: '13800000000',
                status: 'active',
                register_date: new Date()
            },
            {
                username: 'advertiser',
                password: hashedPassword,
                role: 'advertiser',
                company: '测试广告公司',
                email: 'advertiser@example.com',
                phone: '13800000001',
                status: 'active',
                register_date: new Date()
            },
            {
                username: 'editor',
                password: hashedPassword,
                role: 'editor',
                company: '内容编辑部门',
                email: 'editor@example.com',
                phone: '13800000002',
                status: 'active',
                register_date: new Date()
            }
        ]);

        console.log('测试用户创建成功');
    } catch (error) {
        console.error('初始化数据库失败:', error);
    } finally {
        await sequelize.close();
    }
};

initDatabase();
