/** 用户表
 * id: uuid
 * user_name: string
 * user_account: string
 * user_password: string
 * avatar: string
 * money: decimal
 * phone: string
 * address: string
 */

const { Model, DataTypes } = require("sequelize");
// 导入数据实例
const sequelize = require("../database/database");
class User extends Model {}
// 初始化 SystemRole 模型，定义其结构和设置
User.init({
  // 定义 id 字段 自动生成 uuid 并设置为主键
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  user_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  user_account: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true, // 验证器，确保 user_account  不允许为空 并且在表中必须唯一
    },
  },
  user_password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    },
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'images/default_avatar.jpg',
  },
  money: {
    type: DataTypes.DECIMAL,
    allowNull: false,
    defaultValue: 1000
  },
  phone: {
    type: DataTypes.STRING,
  },
  address: {
    type: DataTypes.STRING
  }
}, {
  sequelize, // 指向已经实例化的 Sequelize 实例
  modelName: "User", // 设置在 Sequelize 中使用的模型名称
  tableName: "user", // 设置对应的数据库表名称
  timestamps: true, // 启用 Sequelize 的时间戳功能，自动添加 createdAt 和 updatedAt 字段
  // 钩子 (Hooks) 允许在生命周期事件发生时执行自定义逻辑
  hooks: {
    beforeCreate: (user, option) => {
      // console.log(user);
      // console.log(option);
    },
  },
});

module.exports = User;
