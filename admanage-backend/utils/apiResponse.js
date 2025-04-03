/**
 * 成功响应
 * @param {Object} res - Express响应对象
 * @param {*} data - 响应数据
 * @param {Number} statusCode - HTTP状态码
 */
exports.successResponse = (res, data, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    data
  });
};

/**
 * 错误响应
 * @param {Object} res - Express响应对象
 * @param {String} message - 错误消息
 * @param {Number} statusCode - HTTP状态码
 */
exports.errorResponse = (res, message, statusCode = 500) => {
  console.error(`API错误: ${message}`);
  return res.status(statusCode).json({
    success: false,
    message
  });
}; 