const express = require('express');
const router = express.Router();
const { SystemUser, SystmeRole } = require('../../database/index')
const General = require('../general/index')
const { list, add, edit, del } = General(SystemUser)
const { jwtTokne } = require('../../tool/index')

const getRoleName = (req, res,next) => {
    SystmeRole.findOne({
        where: {
            id: req.body.role_id
        },
        attributes: ['role_name']
    }).then(result => {
        if(!result) {
            res.json({
                code:'400',
                message:'角色查询失败',
                data:null
            })
            return
        }
        next()
        req.body.user_role = result.role_name
    }).catch(err => {
        res.json({
            code:'500',
            message:'角色查询异常',
            data:err
        })
    })
}

router.post('/login', (req, res) => {
    console.log(req.ip);
    SystemUser.findOne({
        raw: true,
        attributes: ['id', 'user_name', 'user_role','role_id'],
        where: req.body
    }).then(result => {
        if (result) {
            let token = jwtTokne(result)
            res.json({
                code: '0000',
                message: '登录成功',
                data: {
                    user: result,
                    token
                }
            })
        } else {
            res.json({
                code: '1001',
                message: '账号或密码有误',
                data: null
            })
        }
    }).catch(err => {
        res.json({
            code: '500',
            message: '操作异常',
            data: err
        })
    })
})

router.get('/list', (req, res) => {
    list(req, res)
})



router.post('/add',getRoleName, (req, res) => {
    add(req, res, )

})

router.put('/edit', getRoleName,(req, res) => {
    edit(req, res)

})

router.delete('/delete', (req, res) => {
    del(req, res)

})
module.exports = router