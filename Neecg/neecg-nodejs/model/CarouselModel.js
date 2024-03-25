
/** 轮播图表
 * key: id, type: uuid
 * key: title, type: string
 * key: introduction, type: string
 * key: image, type: string
 * key: is_using, type: boolean
 */
const { Model, DataTypes } = require('sequelize')
// 导入数据实例
const sequelize = require('../database/database')
class Carousel extends Model { }
// 初始化 SystemRole 模型，定义其结构和设置
Carousel.init({
    // 定义 id 字段 自动生成 uuid 并设置为主键
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      defaultValue: ''
    },
    introduction: {
      type: DataTypes.STRING,
      defaultValue: ''
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false
    },
    is_using: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
}, {
    sequelize,// 指向已经实例化的 Sequelize 实例
    modelName: 'Carousel', // 设置在 Sequelize 中使用的模型名称
    tableName: 'carousel',// 设置对应的数据库表名称
    timestamps: true,// 启用 Sequelize 的时间戳功能，自动添加 createdAt 和 updatedAt 字段
    // 钩子 (Hooks) 允许在生命周期事件发生时执行自定义逻辑
    hooks: {
        beforeCreate: (user, option) => {
            // console.log(user);
            // console.log(option);
        }
    }
})

module.exports = Carousel