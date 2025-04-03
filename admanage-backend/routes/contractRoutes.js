const express = require('express');
const router = express.Router();
const pool = require('../config/db.config');

// 创建合同
router.post('/', async (req, res) => {
    try {
        const [result] = await pool.execute(
            'INSERT INTO contracts (ad_id, status, sign_date) VALUES (?,?,?)',
            [req.body.ad_id, 'pending', null]
        );
        const newContractId = result.insertId;
        const [newContract] = await pool.execute('SELECT * FROM contracts WHERE id =?', [newContractId]);
        res.status(201).json(newContract[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error creating contract', error: error.message });
    }
});

// 获取所有合同
router.get('/', async (req, res) => {
    try {
        const [contracts] = await pool.execute('SELECT * FROM contracts');
        res.json(contracts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching contracts', error: error.message });
    }
});

// 根据 ID 获取合同
router.get('/:id', async (req, res) => {
    try {
        const [contracts] = await pool.execute('SELECT * FROM contracts WHERE id =?', [req.params.id]);
        if (contracts.length > 0) {
            res.json(contracts[0]);
        } else {
            res.status(404).json({ message: 'Contract not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching contract', error: error.message });
    }
});

// 签署合同
router.put('/:id/sign', async (req, res) => {
    try {
        const [result] = await pool.execute(
            'UPDATE contracts SET status =?, sign_date =? WHERE id =?',
            ['signed', new Date().toISOString(), req.params.id]
        );
        if (result.affectedRows > 0) {
            const [updatedContract] = await pool.execute('SELECT * FROM contracts WHERE id =?', [req.params.id]);
            res.json(updatedContract[0]);
        } else {
            res.status(404).json({ message: 'Contract not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error signing contract', error: error.message });
    }
});

module.exports = router;
