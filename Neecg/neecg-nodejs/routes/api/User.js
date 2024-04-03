const express = require('express');
const router = express.Router();
const { User } = require('../../database/index')
const General = require('../general/index')
const { list, add, edit, del } = General(User)
const { testimonial } = require('../../tool/email');
const { jwtTokne } = require('../../tool/index')

// 验证验证码
const codeIsExist = (req, res, next) => {
    const { code } = req.body;
    if (!testimonial.existe(code, false)) {
        res.json({
            code: '1001',
            message: '验证码错误',
        });
        return;
    }
    next();
};

// 验证用户是否存在
const userIsExist = (req, res, next) => {
    User.findOne({
        where: {
            user_account: req.body.user_account
        },
        attributes: ['user_account']
    }).then(result => {
        if (result) {
            res.json({
                code:'201',
                message:'用户已存在',
                data:null
            });
            return;
        }
        // 删除验证码
        testimonial.existe(req.body.code);
        next();
    }).catch(err => {
        res.json({
            code:'500',
            message:'用户查询异常',
            data:err
        })
    });
}

// 注册
router.post('/register', codeIsExist, userIsExist, (req, res) => {
    const { user_account, user_password } = req.body;
    User.create({
        user_name: Date.now().toString(),
        user_account,
        user_password
    }).then(result => {
        res.json({
            code: '0000',
            message: '注册成功'
        });
    }).catch(err => {
        res.json({
            code: '1001',
            message: '注册失败',
            data: err
        });
    });
})

// 登录
router.post('/login', (req, res) => {
    const { user_account, user_password } = req.body;
    User.findOne({
        raw: true,
        where: {
            user_account: user_account,
            user_password: user_password
        }
    }).then(result => {
        if (result) {
            const token = jwtTokne(result);
            res.cookie('milk-token', token).json({
                code:'0000',
                message:'登录成功!',
                data: result
            });
        } else {
            res.json({
                code:'1001',
                message:'登录失败，账号或密码有误!',
                data: result
            });
        }
    });
});
router.get('/info', (req, res) => {
    let id = req.user.id
    User.findOne({
        where:{
            id
        },
        attributes:['user_name','avatar','money','phone','address']
    }).then(result => {
        res.json({
            code: '0000',
            message: '获取成功',
            data: result
        })
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

router.post('/add', (req, res) => {
    add(req, res)
})

router.put('/edit', (req, res) => {
    edit(req, res)
})

router.delete('/delete', (req, res) => {
    del(req, res)
})

module.exports = router