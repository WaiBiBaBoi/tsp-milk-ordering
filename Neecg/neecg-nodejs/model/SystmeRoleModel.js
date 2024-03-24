
const { Model, DataTypes } = require('sequelize')
// 导入数据实例
const sequelize = require('../database/database')
// 定义 SystemRole 类，并继承 Sequelize.Model
class SystemRole extends Model { }
// 初始化 SystemRole 模型，定义其结构和设置
SystemRole.init({
    // 定义 id 字段 自动生成 uuid 并设置为主键
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    role_name: {
        // 定义 角色名称 字段作为 字符串类型 不允许为空 并且在表中必须唯一
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true// 验证器，确保 user_name  不允许为空 并且在表中必须唯一
        }
    },
    route_authority: {
        // 定义 路由权限 字段为 字符串类型  默认空字符串
        type: DataTypes.STRING,
        defaultValue:''
    },
    api_authority: {
        // 定义 api权限 字段为 字符串类型  默认空字符串
        type: DataTypes.STRING,
        defaultValue:''
    },
    remark:{
        // 定义 备注 字段为 字符串类型  默认空字符串
        type: DataTypes.STRING,
    }
}, {
    sequelize,// 指向已经实例化的 Sequelize 实例
    modelName: 'SystemRole', // 设置在 Sequelize 中使用的模型名称
    tableName: 'system_roles',// 设置对应的数据库表名称
    timestamps: true,// 启用 Sequelize 的时间戳功能，自动添加 createdAt 和 updatedAt 字段
    // 钩子 (Hooks) 允许在生命周期事件发生时执行自定义逻辑
    hooks: {
        beforeCreate: (user, option) => {
            // console.log(user);
            // console.log(option);
        }
    }

})

module.exports = SystemRole