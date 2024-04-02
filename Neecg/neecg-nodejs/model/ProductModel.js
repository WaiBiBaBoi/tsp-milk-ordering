const p = {
  id: 'xxxx-xxxx',
  product_name: '纯伊利牛奶',
  images: '封面1.jpg,封面2.jpg,封面3.jpg',
  sales_volume: 114514, // 销量
  commoditys: [
    {
      id: 'xxxx-xxxx',
      commodity_name: '【镇店爆款】21盒纯牛奶',
      introduction: '整箱250ml*21盒 全脂牛奶 优质乳蛋白早餐伴侣 礼盒装',
      price: 49,
      reserve: true
    },
    {
      id: 'xxxx-xxxx',
      commodity_name: '【镇店爆款】26盒纯牛奶',
      introduction: '整箱250ml*21盒 全脂牛奶 优质乳蛋白早餐伴侣 礼盒装',
      price: 59,
      reserve: false // 库存
    }
  ],
  comments: [
    {
      id: 'xxxx-xxxx',
      user_name: 'a',
      comment: '我超 喝了之后直接起飞'
    },
    {
      id: 'xxxx-xxxx',
      user_name: 'b',
      comment: '已经买了100箱 孩子很喜欢'
    }
  ]
}

// 产品表，商品表，评论表

/** 产品表
 * id: uuid
 * product_name: string
 * introduction: text // 简介
 * images: text
 * boutique: boolean // 严选优质
 * sales_volume: int // 销量
 * is_available: boolean // 上架状态
 */

const { Model, DataTypes } = require('sequelize')
// 导入数据实例
const sequelize = require('../database/database')
class Product extends Model { }
// 初始化 SystemRole 模型，定义其结构和设置
Product.init({
    // 定义 id 字段 自动生成 uuid 并设置为主键
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    department_id: {
      // 定义 用户部门 字段为 字符串类型  不允许为空
      type: DataTypes.UUID,
      allowNull: false,
    },
    product_name: {
      type: DataTypes.STRING,
    },
    introduction: {
      type: DataTypes.TEXT,
      defaultValue: ''
    },
    images: {
      type: DataTypes.TEXT,
      defaultValue: ''
    },
    boutique: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    sales_volume: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    is_available: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
}, {
    sequelize,// 指向已经实例化的 Sequelize 实例
    modelName: 'Product', // 设置在 Sequelize 中使用的模型名称
    tableName: 'product',// 设置对应的数据库表名称
    timestamps: true,// 启用 Sequelize 的时间戳功能，自动添加 createdAt 和 updatedAt 字段
    // 钩子 (Hooks) 允许在生命周期事件发生时执行自定义逻辑
    hooks: {
        beforeCreate: (user, option) => {
            // console.log(user);
            // console.log(option);
        }
    }
})

module.exports = Product
