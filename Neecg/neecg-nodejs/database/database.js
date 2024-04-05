// 导入 sequelize
const { Sequelize } = require('sequelize')

// 连接数据库
const sequelize = new Sequelize('neecg', 'root', 'root', {
    host: '127.0.0.1',
    dialect: 'mysql',
    port: 3307
})

module.exports = sequelize