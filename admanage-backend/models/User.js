const pool = require('../config/db.config');
const bcrypt = require('bcryptjs');

class User {
    // 通过用户名查找用户
    static async findByUsername(username) {
        const [rows] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);
        if (rows.length === 0) {
            return null;
        }
        return rows[0];
    }

    // 通过ID查找用户
    static async findById(id) {
        const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [id]);
        if (rows.length === 0) {
            return null;
        }
        return rows[0];
    }

    // 创建新用户
    static async create(userData) {
        try {
            // 不再对密码进行加密
            const hashedPassword = userData.password;

            // 设置默认值
            const role = userData.role || '广告主'; // 使用中文角色名
            const status = userData.status || '活跃'; // 使用中文状态

            console.log('准备插入数据:', {
                username: userData.username,
                password: hashedPassword,
                role,
                company: userData.company,
                email: userData.email,
                phone: userData.phone,
                status
            });

            const [result] = await pool.execute(
                'INSERT INTO users (username, password, role, company, email, phone, status, register_date) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())',
                [
                    userData.username,
                    hashedPassword,
                    role,
                    userData.company,
                    userData.email,
                    userData.phone,
                    status
                ]
            );

            console.log('用户创建结果:', result);
            const newUserId = result.insertId;
            return this.findById(newUserId);
        } catch (error) {
            console.error('创建用户失败:', error);
            throw error; // 重新抛出错误以便上层函数处理
        }
    }

    // 验证用户密码
    static async verifyPassword(plainPassword, hashedPassword) {
        // 直接比较明文密码
        return plainPassword === hashedPassword;
    }

    // 获取所有用户
    static async getAll(role = null) {
        let query = 'SELECT id, username, role, company, email, phone, status, register_date, last_login FROM users';
        const values = [];
        
        if (role) {
            query += ' WHERE role = ?';
            values.push(role);
        }
        
        const [rows] = await pool.execute(query, values);
        return rows;
    }

    // 更新用户信息
    static async update(id, userData) {
        let query = 'UPDATE users SET ';
        const values = [];
        const updateFields = [];

        if (userData.email) {
            updateFields.push('email = ?');
            values.push(userData.email);
        }

        if (userData.company) {
            updateFields.push('company = ?');
            values.push(userData.company);
        }

        if (userData.role) {
            updateFields.push('role = ?');
            values.push(userData.role);
        }

        if (userData.phone) {
            updateFields.push('phone = ?');
            values.push(userData.phone);
        }
        
        if (userData.status) {
            updateFields.push('status = ?');
            values.push(userData.status);
        }

        if (userData.password) {
            // 不再对密码进行加密
            updateFields.push('password = ?');
            values.push(userData.password);
        }

        if (updateFields.length === 0) {
            return null;
        }

        query += updateFields.join(', ') + ' WHERE id = ?';
        values.push(id);

        const [result] = await pool.execute(query, values);
        if (result.affectedRows === 0) {
            return null;
        }

        return this.findById(id);
    }
    
    // 更新最后登录时间
    static async updateLastLogin(id) {
        await pool.execute('UPDATE users SET last_login = NOW() WHERE id = ?', [id]);
        return this.findById(id);
    }
    
    // 获取用户的通知
    static async getNotifications(userId, isRead = null) {
        let query = 'SELECT * FROM notifications WHERE user_id = ?';
        const values = [userId];
        
        if (isRead !== null) {
            query += ' AND is_read = ?';
            values.push(isRead);
        }
        
        query += ' ORDER BY created_at DESC';
        
        console.log('执行通知查询:', query, values);
        const [rows] = await pool.execute(query, values);
        return rows;
    }
    
    // 标记通知为已读
    static async markNotificationRead(notificationId) {
        const [result] = await pool.execute(
            'UPDATE notifications SET is_read = 1, read_at = NOW() WHERE id = ?',
            [notificationId]
        );
        return result.affectedRows > 0;
    }
}

module.exports = User; 