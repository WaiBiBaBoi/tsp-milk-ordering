const express = require('express');
const router = express.Router();
const { SystemMenu, SystmeRole,Op } = require('../../database/index')
const {buildTree,matchAndFilter} = require('../../tool/index')
const General = require('../general/index')
const {list,add,edit,del} = General(SystemMenu)

// 获取系统路由菜单
router.get('/system-menu', async (req, res) => {
    let {route_authority} = await SystmeRole.findOne({
        where:{
            id:req.user.role_id
        },
        attributes:['route_authority']
    })
    SystemMenu.findAll({
        where: {
            enabled: 1
        }
    }).then(queryResult => {
        let result = queryResult.map(instance => instance.get({ plain: true })); // 将 Sequelize 对象 转化为正常对象
        route_authority = route_authority.split(',')
        let matchedArray = result.filter(item => route_authority.includes(item.id));
        res.json({
            code: '0000',
            message: '菜单获取成功',
            data: matchedArray
        })
    }).catch(err => {
        res.json({
            code: '500',
            message: '操作异常',
            data: err
        })
    })
})
// 列表
router.get('/list', (req, res) => {
    //Object.keys 获取 searchParams 对象所有的键。然后用 reduce 方法累加器构建 Sequelize 需要的查询条件格式。
    const whereCondition = Object.keys(req.query).reduce((acc, key) => {
        acc[key] = { [Op.like]: `%${req.query[key]}%` };
        return acc;
    }, {});
    SystemMenu.findAll({
        where: whereCondition
    }).then(queryResult  => {
        console.log(queryResult);
       let result = queryResult.map(instance => instance.get({ plain: true })); // 将 Sequelize 对象 转化为正常对象
       let list = buildTree(result)
        res.json({
            code: '0000',
            message: '路由获取成功',
            data: {
                rows:list
            }
        })
    }).catch(err => {
        res.json({
            code: '500',
            message: '操作异常',
            data: err
        })
    })
})

// 添加
router.post('/add', (req, res) => {
    add(req,res)
})
// 编辑
router.put('/edit', (req, res) => {
    edit(req,res)
})
// 删除
router.delete('/delete', (req, res) => {
    del(req,res)
})




module.exports = router