
const { getPagination } = require('../../tool/index')
const { Op } = require('../../database/index')
const { Sequelize } = require('sequelize')

const General = (model) => {
    const list = (req, res, callback = undefined) => {
        let { limit, offset } = getPagination(req.query.pageNo, req.query.pageSize)
        delete req.query.pageNo
        delete req.query.pageSize
        // 构建模糊查询条件
        //Object.keys 获取 searchParams 对象所有的键。然后用 reduce 方法累加器构建 Sequelize 需要的查询条件格式。
        const whereCondition = Object.keys(req.query).reduce((acc, key) => {
            acc[key] = { [Op.like]: `%${req.query[key]}%` };
            return acc;
        }, {});
        model.findAndCountAll({
            limit: limit,
            offset: offset,
            where: whereCondition,
            order: [["createdAt", "asc"]],
        }).then(result => {
            if (callback == undefined) {
                res.json({
                    code: '0000',
                    message: '获取成功',
                    data: result
                })
            } else {
                callback(result)
            }
        }).catch(err => {
            res.json({
                code: '500',
                message: '操作异常',
                data: err
            })
        })
    }

    const add = async (req, res, LifeCycle = {}) => {
        model.create(req.body)
            .then(result => {
                if (!LifeCycle.callback) {
                    res.json({
                        code: '0000',
                        message: '添加成功',
                        data: result
                    });
                } else {
                    LifeCycle.callback(result);
                }
            })
            .catch(err => {
                if (err instanceof Sequelize.ValidationError) {
                    // 如果错误是由数据验证引起的，发送所有验证错误消息
                    const messages = err.errors.map((e) => e.message);
                    res.json({
                        code: '400', // 400 通常用于客户端错误
                        message: '验证失败',
                        data: messages // 发送所有验证错误
                    });
                } else {
                    // 对于非验证错误，发送通用错误消息
                    res.json({
                        code: '500',
                        message: '操作异常',
                        data: err.message // 通常只发送错误消息而非整个错误对象
                    });
                }
            });
        // model.create(req.body).then(result => {
        //     if (!LifeCycle.callback) {
        //         res.json({
        //             code: '0000',
        //             message: '添加成功',
        //             data: result
        //         })
        //     } else {
        //         LifeCycle.callback(result)
        //     }
        // }).catch(err => {
        //     res.json({
        //         code: '500',
        //         message: '操作异常',
        //         data: err
        //     })
        // })
    }

    const edit = async (req, res, LifeCycle = {}) => {
        let id = req.body.id || req.user.id
        delete req.body.id

        model.findByPk(id).then(instance => {
            if (!instance) {
                // 实例没有找到
                return res.status(404).json({
                    code: '404',
                    message: '实体未找到'
                });
            } else {
                // 实例找到，更新实例的值
                instance.set(req.body);

                // 手动调用验证方法
                return instance.validate().then(() => {
                    // 验证成功，保存更新
                    return instance.save();
                }).then(result => {
                    // 更新成功后的逻辑
                    if (!LifeCycle.callback) {
                        return res.json({
                            code: '0000',
                            message: '编辑成功',
                            data: result
                        });
                    } else {
                        // 如果有回调需要调用
                        LifeCycle.callback(result);
                    }
                });
            }
        }).catch(err => {
            if (err instanceof Sequelize.ValidationError) {
                // 处理验证错误
                const errors = err.errors.map(error => error.message);
                return res.status(400).json({
                    code: '400',
                    message: '验证失败',
                    data: errors
                });
            }
            // 处理其他错误
            console.error(err);
            return res.status(500).json({
                code: '500',
                message: '操作异常',
                data: err.message
            });
        });
        // model.update(req.body, {
        //     where: {
        //         id
        //     }
        // }).then(result => {
        //     if (!LifeCycle.callback) {
        //         res.json({
        //             code: '0000',
        //             message: '编辑成功',
        //             data: result
        //         })
        //     } else {
        //         LifeCycle.callback()
        //     }
        // }).catch(err => {
        //     res.json({
        //         code: '500',
        //         message: '操作异常',
        //         data: err
        //     })
        // })
    }

    const del = (req, res, callback = undefined) => {
        model.destroy({
            where: {
                id: req.body.id
            }
        }).then(result => {
            if (callback == undefined) {
                res.json({
                    code: '0000',
                    message: '删除成功',
                    data: result
                })
            } else {
                callback()
            }
        }).catch(err => {
            res.json({
                code: '500',
                message: '操作异常',
                data: err
            })
        })
    }

    return { list, add, edit, del }
}

module.exports = General