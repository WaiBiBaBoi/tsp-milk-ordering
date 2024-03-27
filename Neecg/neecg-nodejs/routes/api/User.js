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
        delete req.body.code;
        // 注册阶段默认删除金额字段
        delete req.body.money;
        // 🤡tip: 用时间戳作为用户默认名
        req.body.user_name = Date.now().toString();
        next();
    }).catch(err => {
        res.json({
            code:'500',
            message:'用户查询异常',
            data:err
        })
    });
}

/**
 * user_account
 * user_password
 */
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
            res.cookie('token', token).json({
                code:'1000',
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

router.get('/list', (req, res) => {
    list(req, res)
})

router.post('/add', codeIsExist, userIsExist, (req, res) => {
    add(req, res)
})

router.put('/edit', (req, res) => {
    edit(req, res)
})

router.delete('/delete', (req, res) => {
    del(req, res)
})

module.exports = router