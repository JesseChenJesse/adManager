require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function initDatabase() {
  console.log('开始初始化数据库...');
  
  // 读取SQL文件
  const sqlPath = path.join(__dirname, '../data/init-db.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');
  
  // 创建连接
  let connection;
  try {
    // 先创建不指定数据库的连接
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      multipleStatements: true // 允许执行多条SQL语句
    });
    
    // 执行SQL脚本
    console.log('执行SQL脚本...');
    await connection.query(sql);
    
    console.log('数据库初始化成功！');
  } catch (error) {
    console.error('数据库初始化失败:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// 执行初始化
initDatabase(); 