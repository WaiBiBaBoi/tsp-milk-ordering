const express = require('express');
const router = express.Router();
const { Delivery } = require('../../database/index')
const General = require('../general/index')
const { list, add, edit, del } = General(Delivery)

router.get('/list', (req, res) => {
    list(req, res)
})

router.post('/add', (req, res) => {
    req.body.department_id = req.user.department_id
    add(req, res)
})

router.put('/edit', (req, res) => {
    edit(req, res)
})

router.delete('/delete', (req, res) => {
    del(req, res)
})
module.exports = router