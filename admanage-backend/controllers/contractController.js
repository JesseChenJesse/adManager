const fs = require('fs');
const path = require('path');

exports.createContract = async (req, res) => {
  try {
    const contractData = req.body;
    const filePath = path.join(__dirname, '../data/contracts.json');
    
    // 读取现有数据
    let contracts = [];
    if (fs.existsSync(filePath)) {
      contracts = JSON.parse(fs.readFileSync(filePath));
    }
    
    // 添加新合同
    contracts.push({
      id: Date.now().toString(),
      ...contractData,
      status: 'pending',
      createdAt: new Date().toISOString()
    });
    
    // 写入文件
    fs.writeFileSync(filePath, JSON.stringify(contracts, null, 2));
    
    res.status(201).json({ 
      code: 201,
      message: '合同创建成功'
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    });
  }
};

// 修改getMyContracts方法
exports.getMyContracts = async (req, res) => {
  try {
    const filePath = path.join(__dirname, '../data/contracts.json');
    const contracts = fs.existsSync(filePath) 
      ? JSON.parse(fs.readFileSync(filePath))
      : [];
    
    // 只返回当前用户的合同
    const userContracts = contracts.filter(c => c.userId === req.user.userId);
    res.json(userContracts);
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
};

// 修改getAllContracts方法
exports.getAllContracts = async (req, res) => {
  try {
    const filePath = path.join(__dirname, '../data/contracts.json');
    const contracts = fs.existsSync(filePath) 
      ? JSON.parse(fs.readFileSync(filePath))
      : [];
    
    res.json(contracts);
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
};

// 修改reviewContract方法
exports.reviewContract = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const filePath = path.join(__dirname, '../data/contracts.json');
    
    let contracts = fs.existsSync(filePath) 
      ? JSON.parse(fs.readFileSync(filePath))
      : [];
    
    const index = contracts.findIndex(c => c.id === id);
    if (index === -1) {
      return res.status(404).json({ message: '合同不存在' });
    }
    
    contracts[index].status = status;
    contracts[index].reviewedAt = new Date().toISOString();
    
    fs.writeFileSync(filePath, JSON.stringify(contracts, null, 2));
    res.json({ message: '审核成功' });
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
};