const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');

// 通用文件读写方法
const fileHelper = {
  async readData(filename) {
    try {
      const content = await fs.readFile(path.join(DATA_DIR, filename), 'utf8');
      return JSON.parse(content);
    } catch (error) {
      return { data: [] }; // 返回空数据结构
    }
  },

  async writeData(filename, data) {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(
      path.join(DATA_DIR, filename),
      JSON.stringify(data, null, 2),
      'utf8'
    );
  }
};

module.exports = fileHelper;