const express = require('express');
const router = express.Router();
const { Product, Commodity } = require('../../database/index')
const General = require('../general/index')
const { list, add, edit, del } = General(Product)

Product.hasMany(Commodity, {
  foreignKey: 'product_id',
});

router.get('/get', (req, res) => {
  Product.findAndCountAll({
    include: {
      model: Commodity
    }
  }).then(result => {
    res.json({
      data: result
    })
  });
});

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