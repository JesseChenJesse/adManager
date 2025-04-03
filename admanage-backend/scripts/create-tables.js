/**
 * 数据库表创建脚本
 * 运行方式: node scripts/create-tables.js
 */

require('dotenv').config();
const mysql = require('mysql2/promise');

const createTables = async () => {
  let connection;
  
  try {
    // 创建数据库连接
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      multipleStatements: true // 允许执行多条SQL语句
    });
    
    console.log('数据库连接成功');
    
    // 创建数据库（如果不存在）
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'admanager'}`);
    console.log(`数据库 ${process.env.DB_NAME || 'admanager'} 创建成功或已存在`);
    
    // 使用指定的数据库
    await connection.execute(`USE ${process.env.DB_NAME || 'admanager'}`);
    console.log(`已切换至数据库 ${process.env.DB_NAME || 'admanager'}`);
    
    // 创建users表
    console.log('正在创建users表...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id int NOT NULL AUTO_INCREMENT,
        username varchar(32) NOT NULL,
        password varchar(128) NOT NULL,
        role enum('广告主','管理员','广告编辑') NOT NULL,
        company varchar(64) DEFAULT NULL,
        email varchar(64) NOT NULL,
        phone varchar(20) DEFAULT NULL,
        status enum('活跃','禁用') NOT NULL,
        register_date datetime NOT NULL,
        last_login datetime DEFAULT NULL,
        PRIMARY KEY (id),
        UNIQUE KEY username (username),
        UNIQUE KEY email (email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    `);
    console.log('users表创建成功');
    
    // 创建advertisements表
    console.log('正在创建advertisements表...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS advertisements (
        id int NOT NULL AUTO_INCREMENT,
        ad_name varchar(64) NOT NULL,
        ad_type enum('软广','硬广') NOT NULL,
        status enum('待审核','已通过','已拒绝','需修改','内容待编写','内容待审核','进行中','已暂停','已结束') NOT NULL,
        advertiser_id int NOT NULL,
        platform varchar(32) DEFAULT NULL,
        position varchar(32) DEFAULT NULL,
        start_date date DEFAULT NULL,
        end_date date DEFAULT NULL,
        cost decimal(10,2) NOT NULL,
        billing_method enum('CPM','CPC','CPA','按发布次数','按阅读量','按互动量') NOT NULL,
        description text,
        created_at datetime NOT NULL,
        updated_at datetime NOT NULL,
        created_by int NOT NULL,
        PRIMARY KEY (id),
        KEY advertiser_id (advertiser_id),
        KEY created_by (created_by),
        CONSTRAINT advertisements_ibfk_1 FOREIGN KEY (advertiser_id) REFERENCES users (id),
        CONSTRAINT advertisements_ibfk_2 FOREIGN KEY (created_by) REFERENCES users (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    `);
    console.log('advertisements表创建成功');
    
    // 创建soft_ad_contents表
    console.log('正在创建soft_ad_contents表...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS soft_ad_contents (
        id int NOT NULL AUTO_INCREMENT,
        ad_id int NOT NULL,
        content text NOT NULL,
        theme varchar(64) NOT NULL,
        style enum('信息型','故事型','幽默型','情感型') NOT NULL,
        keywords varchar(255) DEFAULT NULL,
        publish_account varchar(64) DEFAULT NULL,
        created_by int NOT NULL,
        created_at datetime NOT NULL,
        updated_at datetime NOT NULL,
        PRIMARY KEY (id),
        KEY ad_id (ad_id),
        KEY created_by (created_by),
        CONSTRAINT soft_ad_contents_ibfk_1 FOREIGN KEY (ad_id) REFERENCES advertisements (id),
        CONSTRAINT soft_ad_contents_ibfk_2 FOREIGN KEY (created_by) REFERENCES users (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    `);
    console.log('soft_ad_contents表创建成功');
    
    // 创建content_reviews表
    console.log('正在创建content_reviews表...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS content_reviews (
        id int NOT NULL AUTO_INCREMENT,
        content_id int NOT NULL,
        status enum('待审核','已通过','已拒绝','自动通过') NOT NULL,
        feedback text,
        reviewer_id int DEFAULT NULL,
        submitted_at datetime NOT NULL,
        reviewed_at datetime DEFAULT NULL,
        deadline datetime NOT NULL,
        PRIMARY KEY (id),
        KEY content_id (content_id),
        KEY reviewer_id (reviewer_id),
        CONSTRAINT content_reviews_ibfk_1 FOREIGN KEY (content_id) REFERENCES soft_ad_contents (id),
        CONSTRAINT content_reviews_ibfk_2 FOREIGN KEY (reviewer_id) REFERENCES users (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    `);
    console.log('content_reviews表创建成功');
    
    // 创建notifications表
    console.log('正在创建notifications表...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS notifications (
        id int NOT NULL AUTO_INCREMENT,
        user_id int NOT NULL,
        type enum('系统通知','审核通知','合同通知') NOT NULL,
        title varchar(128) NOT NULL,
        message text NOT NULL,
        is_read tinyint(1) NOT NULL DEFAULT '0',
        link varchar(255) DEFAULT NULL,
        created_at datetime NOT NULL,
        read_at datetime DEFAULT NULL,
        PRIMARY KEY (id),
        KEY user_id (user_id),
        CONSTRAINT notifications_ibfk_1 FOREIGN KEY (user_id) REFERENCES users (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    `);
    console.log('notifications表创建成功');
    
    // 创建contracts表
    console.log('正在创建contracts表...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS contracts (
        id int NOT NULL AUTO_INCREMENT,
        ad_id int NOT NULL,
        contract_number varchar(32) NOT NULL,
        status enum('草稿','待签署','已签署','已取消','已过期') NOT NULL,
        file_path varchar(255) DEFAULT NULL,
        total_amount decimal(10,2) NOT NULL,
        effective_date datetime NOT NULL,
        expiry_date datetime NOT NULL,
        signed_at datetime DEFAULT NULL,
        signed_by int DEFAULT NULL,
        created_at datetime NOT NULL,
        PRIMARY KEY (id),
        UNIQUE KEY contract_number (contract_number),
        KEY ad_id (ad_id),
        KEY signed_by (signed_by),
        CONSTRAINT contracts_ibfk_1 FOREIGN KEY (ad_id) REFERENCES advertisements (id),
        CONSTRAINT contracts_ibfk_2 FOREIGN KEY (signed_by) REFERENCES users (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    `);
    console.log('contracts表创建成功');
    
    // 创建测试管理员账户
    console.log('正在创建测试账户...');
    const adminExists = await connection.execute(`SELECT id FROM users WHERE username = 'admin'`);
    if (adminExists[0].length === 0) {
      await connection.execute(`
        INSERT INTO users (username, password, role, email, status, register_date)
        VALUES ('admin', '$2a$10$xDmKUiG/uAsoGjlP.fYwseTB7LRzQoPmI0YnDEVS.UqOWLesHEUBi', '管理员', 'admin@example.com', '活跃', NOW())
      `);
      console.log('管理员账户创建成功（用户名: admin, 密码: admin123）');
    } else {
      console.log('管理员账户已存在，跳过创建');
    }
    
    console.log('数据库初始化完成');
    
  } catch (error) {
    console.error('数据库初始化失败:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('数据库连接已关闭');
    }
  }
};

// 执行创建表函数
createTables(); 