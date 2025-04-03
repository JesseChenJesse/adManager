-- 创建数据库
CREATE DATABASE IF NOT EXISTS admanage_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 使用数据库
USE admanage_db;

-- 用户表
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(32) NOT NULL UNIQUE COMMENT '登录账号',
  password VARCHAR(128) NOT NULL COMMENT '密码',
  role ENUM('advertiser', 'editor', 'admin', 'reviewer') NOT NULL DEFAULT 'advertiser' COMMENT '广告主/广告编辑/管理员/审核员',
  company VARCHAR(64) COMMENT '所属单位',
  email VARCHAR(64) NOT NULL UNIQUE COMMENT '联系邮箱',
  phone VARCHAR(20) COMMENT '联系电话',
  status ENUM('active', 'disabled') NOT NULL DEFAULT 'active' COMMENT '活跃/禁用',
  register_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '用户注册时间',
  last_login DATETIME COMMENT '用户最后登录时间'
);

-- 广告表
CREATE TABLE IF NOT EXISTS advertisements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ad_name VARCHAR(64) NOT NULL COMMENT '广告标题',
  ad_type ENUM('hard', 'soft') NOT NULL COMMENT '硬广/软广',
  status ENUM('pending', 'approved', 'rejected', 'need_revision', 'content_pending', 'content_reviewing', 'in_progress', 'paused', 'ended') NOT NULL DEFAULT 'pending' COMMENT '待审核/已通过/已拒绝/需修改/内容待编写/内容待审核/进行中/已暂停/已结束',
  advertiser_id INT NOT NULL COMMENT '广告主ID',
  platform VARCHAR(32) COMMENT '发布平台',
  position VARCHAR(32) COMMENT '广告位置',
  start_date DATE COMMENT '投放开始日期',
  end_date DATE COMMENT '投放结束日期',
  cost DECIMAL(10,2) NOT NULL COMMENT '广告费用',
  billing_method ENUM('CPM', 'CPC', 'CPA', 'publish_count', 'read_count', 'interaction_count') NOT NULL COMMENT 'CPM/CPC/CPA/按发布次数/按阅读量/按互动量',
  description TEXT COMMENT '广告详细描述',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '记录创建时间',
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '记录更新时间',
  created_by INT COMMENT '创建人',
  FOREIGN KEY (advertiser_id) REFERENCES users(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- 软文内容表
CREATE TABLE IF NOT EXISTS soft_ad_contents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ad_id INT NOT NULL COMMENT '关联广告ID',
  content TEXT NOT NULL COMMENT '软文内容',
  theme VARCHAR(64) NOT NULL COMMENT '软文主题',
  style ENUM('informative', 'story', 'humorous', 'emotional') NOT NULL COMMENT '信息型/故事型/幽默型/情感型',
  keywords VARCHAR(255) COMMENT '软文关键词，逗号分隔',
  publish_account VARCHAR(64) COMMENT '软文发布账号',
  created_by INT NOT NULL COMMENT '创建人',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '记录创建时间',
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '记录更新时间',
  FOREIGN KEY (ad_id) REFERENCES advertisements(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- 合同表
CREATE TABLE IF NOT EXISTS contracts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ad_id INT NOT NULL COMMENT '关联广告ID',
  contract_number VARCHAR(32) NOT NULL UNIQUE COMMENT '系统生成的唯一合同编号',
  status ENUM('draft', 'pending', 'signed', 'canceled', 'expired') NOT NULL DEFAULT 'draft' COMMENT '草稿/待签署/已签署/已取消/已过期',
  file_path VARCHAR(255) COMMENT '合同文件存储路径',
  total_amount DECIMAL(10,2) NOT NULL COMMENT '合同约定的总金额',
  effective_date DATETIME NOT NULL COMMENT '合同生效日期',
  expiry_date DATETIME NOT NULL COMMENT '合同到期日期',
  signed_at DATETIME COMMENT '合同签署时间',
  signed_by INT COMMENT '签署人',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '记录创建时间',
  FOREIGN KEY (ad_id) REFERENCES advertisements(id),
  FOREIGN KEY (signed_by) REFERENCES users(id)
);

-- 通知表
CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL COMMENT '关联用户ID',
  type ENUM('system', 'review', 'contract') NOT NULL COMMENT '系统通知/审核通知/合同通知',
  title VARCHAR(128) NOT NULL COMMENT '通知标题',
  message TEXT NOT NULL COMMENT '通知内容',
  is_read BOOLEAN NOT NULL DEFAULT FALSE COMMENT '是否已读',
  link VARCHAR(255) COMMENT '通知相关链接',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '通知创建时间',
  read_at DATETIME COMMENT '通知阅读时间',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 广告素材表
CREATE TABLE IF NOT EXISTS ad_materials (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ad_id INT NOT NULL COMMENT '关联广告ID',
  file_path VARCHAR(255) NOT NULL COMMENT '文件路径',
  file_type VARCHAR(50) NOT NULL COMMENT '文件类型',
  file_size INT NOT NULL COMMENT '文件大小',
  upload_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '上传时间',
  FOREIGN KEY (ad_id) REFERENCES advertisements(id) ON DELETE CASCADE
);

-- 创建管理员账户
INSERT INTO users (username, password, role, email, company, status)
VALUES ('admin', '$2a$10$DH2QJ/fHH/jHhSswXcnmWeglOvMxGz3XBNpvGRhW0vyv3iDFE4fBO', 'admin', 'admin@example.com', '系统管理中心', 'active');

-- 创建广告主账户
INSERT INTO users (username, password, role, email, company, phone, status)
VALUES ('advertiser1', '$2a$10$DH2QJ/fHH/jHhSswXcnmWeglOvMxGz3XBNpvGRhW0vyv3iDFE4fBO', 'advertiser', 'advertiser1@example.com', '示例公司A', '13800138000', 'active');

-- 创建审核员账户
INSERT INTO users (username, password, role, email, company, status)
VALUES ('reviewer1', '$2a$10$DH2QJ/fHH/jHhSswXcnmWeglOvMxGz3XBNpvGRhW0vyv3iDFE4fBO', 'reviewer', 'reviewer1@example.com', '内容审核部', 'active');

-- 创建编辑账户
INSERT INTO users (username, password, role, email, company, status)
VALUES ('editor1', '$2a$10$DH2QJ/fHH/jHhSswXcnmWeglOvMxGz3XBNpvGRhW0vyv3iDFE4fBO', 'editor', 'editor1@example.com', '内容编辑部', 'active');

-- 注意：以上密码均为加密后的 "password123" 