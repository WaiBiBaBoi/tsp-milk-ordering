const express = require('express');
const router = express.Router();
const { Comment } = require('../../database/index')
const General = require('../general/index')
const { list, add, edit, del } = General(Comment)

router.get('/list', (req, res) => {
    list(req, res)
})

router.post('/add', (req, res) => {
    req.body.user_id = req.user.id
    add(req, res)

})

router.put('/edit', (req, res) => {
    edit(req, res)
})

router.delete('/delete', (req, res) => {
    del(req, res)
})

module.exports = router