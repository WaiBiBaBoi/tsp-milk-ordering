const express = require('express');
const router = express.Router();
const { buildTree } = require('../../tool/index')
const { SystemMenu, SystmeRole } = require('../../database/index')

// 用来获取设置路由权限的列表操作
router.get('/routePermissions-list', async (req, res) => {
    let {route_authority} = await SystmeRole.findOne({
        where: {
            id: req.query.id
        },
        attributes: ['route_authority']
    })
    SystemMenu.findAll({
        row: true,
        attributes: ['id', 'menu_name', 'parent_id']
    }).then(queryResult => {
        let result = queryResult.map(instance => instance.get({ plain: true })); // 将 Sequelize 对象 转化为正常对象
        let list = buildTree(result)
        if(!route_authority){
            route_authority = []
        }else{
            route_authority = route_authority.split(',')
        }
        res.json({
            code: '0000',
            message: '获取成功',
            data: {
                list,
                route_authority
            }
        })
    }).catch(err => {
        res.json({
            code:'500',
            message:'操作异常',
            data:err
        })
    })
})

router.put('/routePermissions-set',(req,res) => {
    console.log(req.body);
    let id = req.body.id
    delete req.body.id
    SystmeRole.update(req.body,{
        where:{
            id
        }
    }).then(result => {
        res.json({
            code:'0000',
            message:'设置成功',
            data:result
        })
    }).catch(err => {
        res.json({
            code:'500',
            message:'操作异常',
            data:err
        })
    })
})


module.exports = router