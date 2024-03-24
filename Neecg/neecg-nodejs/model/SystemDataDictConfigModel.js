
const { Model, DataTypes } = require('sequelize')
// 导入数据实例
const sequelize = require('../database/database')
// 定义 SystemDataDictConfig 类，并继承 Sequelize.Model
class SystemDataDictConfig extends Model { }
// 初始化 SystemDataDictConfig 模型，定义其结构和设置
SystemDataDictConfig.init({
    // 定义 id 字段 自动生成 uuid 并设置为主键
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    dict_code: {
        // 定义 字典编号 字段为 字符串类型  不允许为空
        type: DataTypes.STRING,
        allowNull: false,
    },
    dict_key_name: {
        // 定义 字典键名 字段作为 字符串类型 不允许为空 并且在表中必须唯一
        type: DataTypes.STRING,
        allowNull: false,
        // unique: true,
        validate: {
            // notEmpty: true,// 验证器，确保 dict_name  不允许为空 并且在表中必须唯一
            notEmpty: {
                msg: '字典键名不能为空' // 自定义错误消息
              }
        },
    },
    dict_key_value: {
        // 定义 字典键值 字段作为 字符串类型 不允许为空 并且在表中必须唯一
        type: DataTypes.STRING,
        allowNull: false,
        // unique: true,
        validate: {
            // notEmpty: true,// 验证器，确保 dict_code  不允许为空 并且在表中必须唯一
            notEmpty: {
                msg: '字典键值不能为空' // 自定义错误消息
              }
        },
    },
    createBy: {
        type: DataTypes.STRING,
    },
    updateBy: {
        type: DataTypes.STRING,
    },
}, {
    sequelize,// 指向已经实例化的 Sequelize 实例
    modelName: 'SystemDataDictConfig', // 设置在 Sequelize 中使用的模型名称
    tableName: 'system_data_dict_cinfigs',// 设置对应的数据库表名称
    timestamps: true,// 启用 Sequelize 的时间戳功能，自动添加 createdAt 和 updatedAt 字段
    // 钩子 (Hooks) 允许在生命周期事件发生时执行自定义逻辑
    hooks: {
        beforeCreate: (user, option) => {
            // console.log(user);
            // console.log(option);
        }
    }

})

module.exports = SystemDataDictConfig