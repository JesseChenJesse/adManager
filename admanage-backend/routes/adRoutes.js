const express = require('express');
const router = express.Router();
const adController = require('../controllers/adController');
const Ad = require('../models/Ad');
const { verifyToken, checkRole } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

// 获取广告列表（支持筛选、分页）
router.get('/', verifyToken, adController.getAds);

// 获取单个广告详情
router.get('/:id', verifyToken, adController.getAdById);

// 创建广告申请
router.post('/', verifyToken, adController.createAd);

// 审核广告（仅允许管理员和审核员）
router.put('/:id/review', verifyToken, checkRole(['admin', 'reviewer']), adController.reviewAd);

// 删除广告
router.delete('/:id', verifyToken, checkRole(['admin']), adController.deleteAd);

// 创建或更新软文内容
router.put('/:id/content', verifyToken, adController.updateAdContent);

// 上传广告素材
router.post('/:id/materials', verifyToken, upload.array('files', 5), async (req, res) => {
  try {
    const adId = req.params.id;
    const files = req.files;
    
    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: '未提供文件'
      });
    }
    
    const materials = [];
    for (const file of files) {
      const material = await Ad.addMaterial(adId, {
        path: file.path.replace('\\', '/'),
        mimetype: file.mimetype,
        size: file.size
      });
      materials.push(material);
    }
    
    res.status(201).json({
      success: true,
      data: materials
    });
  } catch (error) {
    console.error('上传素材失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误，上传素材失败'
    });
  }
});

module.exports = router;
