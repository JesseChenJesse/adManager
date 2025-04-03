const Ad = require('../models/Ad');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// 创建新广告申请
exports.createAd = async (req, res) => {
  try {
    const adData = req.body;
    
    // 添加用户ID作为广告主
    adData.advertiser_id = req.user.id;
    adData.created_by = req.user.id;
    
    // 验证必要字段
    const requiredFields = ['ad_name', 'ad_type', 'cost', 'billing_method'];
    const missingFields = requiredFields.filter(field => !adData[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: `缺少必要字段: ${missingFields.join(', ')}` 
      });
    }
    
    // 创建广告
    const newAd = await Ad.create(adData);
    
    res.status(201).json({
      success: true,
      data: newAd
    });
  } catch (error) {
    console.error('创建广告申请失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误，创建广告申请失败'
    });
  }
};

// 获取广告列表（带筛选、分页）
exports.getAds = async (req, res) => {
  try {
    const { page = 1, pageSize = 10, status, adType, keyword } = req.query;
    
    // 根据用户角色决定是否限制查看范围
    let advertiserId = null;
    if (req.user.role === 'advertiser') {
      advertiserId = req.user.id;
    }
    
    const result = await Ad.search({
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      status,
      adType,
      keyword,
      advertiserId
    });
    
    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('获取广告列表失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误，获取广告列表失败'
    });
  }
};

// 获取单个广告详情
exports.getAdById = async (req, res) => {
  try {
    const adId = req.params.id;
    const ad = await Ad.getById(adId);
    
    if (!ad) {
      return res.status(404).json({
        success: false,
        message: '广告不存在'
      });
    }
    
    // 检查权限：只有管理员、审核员或广告创建者可以查看
    if (req.user.role !== 'admin' && req.user.role !== 'reviewer' && ad.advertiser_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: '没有权限查看此广告'
      });
    }
    
    res.json({
      success: true,
      data: ad
    });
  } catch (error) {
    console.error('获取广告详情失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误，获取广告详情失败'
    });
  }
};

// 审核广告
exports.reviewAd = async (req, res) => {
  try {
    const adId = req.params.id;
    const { status, reviewComment } = req.body;
    
    // 验证状态是否有效
    const validStatuses = ['approved', 'rejected', 'need_revision'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: '无效的审核状态'
      });
    }
    
    // 更新广告状态
    const updatedAd = await Ad.updateStatus(adId, status, reviewComment);
    
    if (!updatedAd) {
      return res.status(404).json({
        success: false,
        message: '广告不存在'
      });
    }
    
    res.json({
      success: true,
      data: updatedAd
    });
  } catch (error) {
    console.error('审核广告失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误，审核广告失败'
    });
  }
};

// 创建或更新软文内容
exports.updateAdContent = async (req, res) => {
  try {
    const adId = req.params.id;
    const contentData = req.body;
    contentData.created_by = req.user.id;
    
    // 验证必要字段
    const requiredFields = ['content', 'theme', 'style'];
    const missingFields = requiredFields.filter(field => !contentData[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: `缺少必要字段: ${missingFields.join(', ')}` 
      });
    }
    
    // 获取广告信息
    const ad = await Ad.getById(adId);
    if (!ad) {
      return res.status(404).json({
        success: false,
        message: '广告不存在'
      });
    }
    
    // 检查是否为软文广告
    if (ad.ad_type !== 'soft') {
      return res.status(400).json({
        success: false,
        message: '只有软文广告可以添加内容'
      });
    }
    
    // 检查权限
    if (req.user.role !== 'admin' && req.user.role !== 'editor' && ad.advertiser_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: '没有权限修改此广告内容'
      });
    }
    
    let adContent;
    if (ad.content) {
      adContent = await Ad.updateContent(adId, contentData);
    } else {
      adContent = await Ad.createContent(adId, contentData);
    }
    
    res.json({
      success: true,
      data: adContent
    });
  } catch (error) {
    console.error('更新广告内容失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误，更新广告内容失败'
    });
  }
};

// 删除广告
exports.deleteAd = async (req, res) => {
  try {
    const adId = req.params.id;
    
    // 获取广告详情，检查权限
    const ad = await Ad.getById(adId);
    if (!ad) {
      return res.status(404).json({
        success: false,
        message: '广告不存在或已被删除'
      });
    }
    
    // 只有管理员或广告创建者可以删除
    if (req.user.role !== 'admin' && ad.advertiser_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: '没有权限删除此广告'
      });
    }
    
    const success = await Ad.delete(adId);
    
    res.json({
      success: true,
      message: '广告已成功删除'
    });
  } catch (error) {
    console.error('删除广告失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误，删除广告失败'
    });
  }
};

// 状态变更操作统一处理
const statusAction = (action) => async (req, res) => {
  try {
    await Ad.updateStatus(req.params.id, action);
    successResponse(res, { action });
  } catch (error) {
    errorResponse(res, error.message);
  }
};

exports.pauseAd = statusAction('pause');
exports.startAd = statusAction('start');
