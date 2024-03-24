const express = require('express');
const router = express.Router();
const sequelize = require('../../database/database')
const { Sequelize } = require('sequelize')

router.post('/select-list', (req, res) => {
    // 前端传入的表名
    console.log(req.body);
    let arr
    if(req.body.dict){
        arr = req.body.dict.split(',')
    }else{
        res.json({
            code: '1001',
            message: '传参异常',
            data: null
        })
    }
    const tableName = arr[0]; // 假设从请求体中获取表名
    // 查询表信息
    sequelize.query(`SHOW TABLES LIKE '${tableName}'`, { type: Sequelize.QueryTypes.SHOWTABLES })
        .then(results => {
            if (results.length > 0) {
                // 表存在，可以进行查询操作
                // 执行查询
                // 获取查询字段
                const fields = arr.slice(1); // 假设从请求体中获取查询字段
                // 构建 SQL 查询语句
                const query = `SELECT ${fields.join(',')} FROM ${tableName}`;
                // 进行你的查询操作
                sequelize.query(query, { type: Sequelize.QueryTypes.SELECT })
                    .then(results => {
                        console.log(results);
                        // 在这里处理查询结果
                        res.json({
                            code: '0000',
                            message: '获取成功',
                            data: results
                        })
                    })
                    .catch(error => {
                        console.error('查询出错:', error);
                        // 错误处理
                        res.json({
                            code: '1001',
                            message: '查询出错',
                            data: null
                        })
                    });
            } else {
                // 表不存在，进行错误处理
                console.error('表不存在');
                // 其他处理逻辑
                res.json({
                    code: '1001',
                    message: '表不存在',
                    data: null
                })
            }
        })
        .catch(error => {
            console.error('查询出错:', error);
            // 错误处理
        });
})

module.exports = router