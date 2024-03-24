const express = require('express');
const router = express.Router();
const { SystemDataDict } = require('../../database/index')
const General = require('../general/index')
const { list, add, edit, del } = General(SystemDataDict)

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