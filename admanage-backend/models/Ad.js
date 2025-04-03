const pool = require('../config/db.config');

class Ad {
    // 创建广告
    static async create(adData) {
        const [result] = await pool.execute(
            'INSERT INTO advertisements (ad_name, ad_type, status, advertiser_id, platform, position, start_date, end_date, cost, billing_method, description, created_by) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',
            [
                adData.ad_name,
                adData.ad_type,
                adData.status || 'pending',
                adData.advertiser_id,
                adData.platform,
                adData.position,
                adData.start_date,
                adData.end_date,
                adData.cost,
                adData.billing_method,
                adData.description,
                adData.created_by
            ]
        );
        const newAdId = result.insertId;
        const [newAd] = await pool.execute('SELECT * FROM advertisements WHERE id = ?', [newAdId]);
        return newAd[0];
    }

    // 分页查询（带过滤条件）
    static async search({ page = 1, pageSize = 10, status, adType, keyword, advertiserId }) {
        let query = 'SELECT * FROM advertisements WHERE 1 = 1';
        const values = [];

        if (status) {
            query += ' AND status = ?';
            values.push(status);
        }
        if (adType) {
            query += ' AND ad_type = ?';
            values.push(adType);
        }
        if (keyword) {
            query += ' AND (ad_name LIKE ? OR description LIKE ?)';
            values.push(`%${keyword}%`, `%${keyword}%`);
        }
        if (advertiserId) {
            query += ' AND advertiser_id = ?';
            values.push(advertiserId);
        }

        const countQuery = `SELECT COUNT(*) as total FROM (${query}) as subquery`;
        const [countResult] = await pool.execute(countQuery, values);
        const total = countResult[0].total;

        const startIndex = (page - 1) * pageSize;
        query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
        values.push(parseInt(pageSize), parseInt(startIndex));

        const [rows] = await pool.execute(query, values);

        return {
            data: rows,
            total,
            page: parseInt(page),
            pageSize: parseInt(pageSize)
        };
    }
    
    // 获取单个广告详情
    static async getById(id) {
        const [rows] = await pool.execute('SELECT * FROM advertisements WHERE id = ?', [id]);
        if (rows.length === 0) {
            return null;
        }
        
        // 获取相关软文内容（如果是软广）
        const ad = rows[0];
        if (ad.ad_type === 'soft') {
            const [contentRows] = await pool.execute('SELECT * FROM soft_ad_contents WHERE ad_id = ?', [id]);
            if (contentRows.length > 0) {
                ad.content = contentRows[0];
            }
        }
        
        // 获取相关素材
        const [materialRows] = await pool.execute('SELECT * FROM ad_materials WHERE ad_id = ?', [id]);
        if (materialRows.length > 0) {
            ad.materials = materialRows;
        }
        
        return ad;
    }
    
    // 更新广告状态（审核）
    static async updateStatus(id, status, reviewComment) {
        const [result] = await pool.execute(
            'UPDATE advertisements SET status = ? WHERE id = ?',
            [status, id]
        );
        
        if (result.affectedRows === 0) {
            return null;
        }
        
        // 如果有审核意见，创建通知
        if (reviewComment) {
            const [adRows] = await pool.execute('SELECT advertiser_id, ad_name FROM advertisements WHERE id = ?', [id]);
            if (adRows.length > 0) {
                const ad = adRows[0];
                
                // 创建审核通知
                await pool.execute(
                    'INSERT INTO notifications (user_id, type, title, message, link) VALUES (?, ?, ?, ?, ?)',
                    [
                        ad.advertiser_id,
                        'review',
                        `广告"${ad.ad_name}"审核${status === 'approved' ? '通过' : '未通过'}`,
                        reviewComment,
                        `/ads/${id}`
                    ]
                );
            }
        }
        
        return this.getById(id);
    }
    
    // 删除广告
    static async delete(id) {
        const [result] = await pool.execute('DELETE FROM advertisements WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
    
    // 创建软文内容
    static async createContent(adId, contentData) {
        const [result] = await pool.execute(
            'INSERT INTO soft_ad_contents (ad_id, content, theme, style, keywords, publish_account, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [
                adId,
                contentData.content,
                contentData.theme,
                contentData.style,
                contentData.keywords,
                contentData.publish_account,
                contentData.created_by
            ]
        );
        
        // 更新广告状态为内容待审核
        await pool.execute('UPDATE advertisements SET status = "content_reviewing" WHERE id = ?', [adId]);
        
        const [contentRows] = await pool.execute('SELECT * FROM soft_ad_contents WHERE id = ?', [result.insertId]);
        return contentRows[0];
    }
    
    // 更新软文内容
    static async updateContent(adId, contentData) {
        const [result] = await pool.execute(
            'UPDATE soft_ad_contents SET content = ?, theme = ?, style = ?, keywords = ?, publish_account = ?, updated_at = NOW() WHERE ad_id = ?',
            [
                contentData.content,
                contentData.theme,
                contentData.style,
                contentData.keywords,
                contentData.publish_account,
                adId
            ]
        );
        
        if (result.affectedRows === 0) {
            return null;
        }
        
        const [contentRows] = await pool.execute('SELECT * FROM soft_ad_contents WHERE ad_id = ?', [adId]);
        return contentRows[0];
    }
    
    // 添加广告素材
    static async addMaterial(adId, file) {
        const [result] = await pool.execute(
            'INSERT INTO ad_materials (ad_id, file_path, file_type, file_size) VALUES (?, ?, ?, ?)',
            [
                adId,
                file.path,
                file.mimetype,
                file.size
            ]
        );
        
        const [materialRows] = await pool.execute('SELECT * FROM ad_materials WHERE id = ?', [result.insertId]);
        return materialRows[0];
    }
    
    // 删除广告素材
    static async deleteMaterial(materialId) {
        const [result] = await pool.execute('DELETE FROM ad_materials WHERE id = ?', [materialId]);
        return result.affectedRows > 0;
    }
}

module.exports = Ad;
