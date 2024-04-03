/** 评论表
 * id: uuid
 * user_id: uuid
 * product_id: uuid // 产品id
 * comment: text // 评论
 */

const { Model, DataTypes } = require('sequelize')
// 导入数据实例
const sequelize = require('../database/database')
const User = require('./UserModel')
const Product = require('./ProductModel');
class Comment extends Model { }
// 初始化 SystemRole 模型，定义其结构和设置
Comment.init({
    // 定义 id 字段 自动生成 uuid 并设置为主键
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    user_id: {
      type: DataTypes.UUID,
      references: {
        model: User,
        key: 'id'
      },
      allowNull: false
    },
    product_id: {
      type: DataTypes.UUID,
      references: {
        model: Product,
        key: 'id'
      },
      allowNull: false
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    images: {
      type: DataTypes.TEXT,
      defaultValue: ''
    }
}, {
    sequelize,// 指向已经实例化的 Sequelize 实例
    modelName: 'Comment', // 设置在 Sequelize 中使用的模型名称
    tableName: 'comment',// 设置对应的数据库表名称
    timestamps: true,// 启用 Sequelize 的时间戳功能，自动添加 createdAt 和 updatedAt 字段
    // 钩子 (Hooks) 允许在生命周期事件发生时执行自定义逻辑
    hooks: {
        beforeCreate: (user, option) => {
            // console.log(user);
            // console.log(option);
        }
    }
})


module.exports = Comment