// 该文件用于测试与数据库的链接

//  require('dotenv').config();
// const mysql = require('mysql2/promise');

// async function testConnection() {
//     const connection = await mysql.createConnection({
//         host: process.env.DB_HOST,
//         port: process.env.DB_PORT,
//         user: process.env.DB_USER,
//         password: process.env.DB_PASSWORD,
//         database: process.env.DB_NAME,
//     });

//     try {
//         await connection.connect();
//         console.log('数据库连接成功！');
//     } catch (error) {
//         console.error('数据库连接失败:', error);
//     } finally {
//         await connection.end();
//     }
// }

// testConnection();

require('dotenv').config();

// 打印环境变量，用于调试
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_NAME:', process.env.DB_NAME);

const mysql = require('mysql2/promise');

async function testConnection() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });

    try {
        await connection.connect();
        console.log('数据库连接成功！');
    } catch (error) {
        console.error('数据库连接失败:', error);
    } finally {
        await connection.end();
    }
}

testConnection();