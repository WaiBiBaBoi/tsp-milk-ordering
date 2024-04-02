const express = require('express');
const router = express.Router();
const { SystemUser, SystmeRole,SystemDepartment } = require('../../database/index')
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
        req.body.user_role = result.role_name
        next()
    }).catch(err => {
        res.json({
            code:'500',
            message:'角色查询异常',
            data:err
        })
    })
}
const getDepartmentName = (req, res,next) => {
    SystemDepartment.findOne({
        where: {
            id: req.body.department_id
        },
        attributes: ['department_name','is_protected']
    }).then(result => {
        if(!result) {
            res.json({
                code:'400',
                message:'部门查询失败',
                data:null
            })
            return
        }
        req.body.department_name = result.department_name
        req.body.is_protected = result.is_protected
        next()
    }).catch(err => {
        res.json({
            code:'500',
            message:'部门查询异常',
            data:err
        })
    })
}

router.post('/login', (req, res) => {
    SystemUser.findOne({
        raw: true,
        attributes: ['id', 'user_name', 'user_role','role_id','department_id','is_protected'],
        where: req.body
    }).then(result => {
        if (result) {
            let token = jwtTokne(result)
            delete result.id
            delete result.role_id
            delete result.department_id
            delete result.is_protected
            res.json({
                code: '0000',
                message: '登录成功',
                data: {
                    user: result,
                    token,
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
router.post('/add',getRoleName,getDepartmentName, (req, res) => {
    add(req, res, )
})

router.put('/edit', getRoleName,getDepartmentName,(req, res) => {
    edit(req, res)

})
router.delete('/delete', (req, res) => {
    del(req, res)

})
module.exports = router