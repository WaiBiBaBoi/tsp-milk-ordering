/** 商品表
 * id: uuid
 * product_id: uuid
 * commodity_name: string
 * introduction: text // 简介
 * price: DECIMAL
 * is_available: boolean // 商品是否上架
 * reserve: boolean // 库存
 */

const { Model, DataTypes } = require('sequelize')
// 导入数据实例
const sequelize = require('../database/database')
const Product = require('./ProductModel');
class Commodity extends Model { }
// 初始化 SystemRole 模型，定义其结构和设置
Commodity.init({
    // 定义 id 字段 自动生成 uuid 并设置为主键
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    product_id: {
      type: DataTypes.UUID,
      references: {
        model: Product,
        key: 'id'
      },
      allowNull: false
    },
    commodity_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    introduction: {
      type: DataTypes.TEXT,
      defaultValue: ''
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    is_available: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    reserve: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
}, {
    sequelize,// 指向已经实例化的 Sequelize 实例
    modelName: 'Commodity', // 设置在 Sequelize 中使用的模型名称
    tableName: 'commodity',// 设置对应的数据库表名称
    timestamps: true,// 启用 Sequelize 的时间戳功能，自动添加 createdAt 和 updatedAt 字段
    // 钩子 (Hooks) 允许在生命周期事件发生时执行自定义逻辑
    hooks: {
        beforeCreate: (user, option) => {
            // console.log(user);
            // console.log(option);
        }
    }
})


module.exports = Commodity