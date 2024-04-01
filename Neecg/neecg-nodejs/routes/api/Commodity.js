const express = require('express');
const router = express.Router();
const { Product, Commodity } = require('../../database/index')
const General = require('../general/index')
const { list, add, edit, del } = General(Commodity)

// Commodity.belongsTo(Product, {
//   foreignKey: 'product_id',
//   targetKey: 'id',
// });

// router.get('/getCommodityList', (req, res) => {
//   Commodity.findAndCountAll({
//     include: {
//       model: Product,
//     }
//   }).then(result => {
//     res.json({
//       code: "0000",
//       message: "查询成功",
//       data: result
//     });
//   });
// });

router.get('/list', (req, res) => {
    list(req, res)
})
router.get('/listAll', (req, res) => {
    Commodity.findAll({
        order: [["createdAt", "desc"]],
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