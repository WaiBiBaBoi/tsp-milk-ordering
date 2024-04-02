const { Model, DataTypes } = require("sequelize");
// 导入数据实例
const sequelize = require("../database/database");
// 定义 SystemUser 类，并继承 Sequelize.Model
class SystemUser extends Model {}
// 初始化 SystemUser 模型，定义其结构和设置
SystemUser.init(
  {
    // 定义 id 字段 自动生成 uuid 并设置为主键
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_name: {
      // 定义 用户名称 字段作为 字符串类型 不允许为空 并且在表中必须唯一
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true, // 验证器，确保 user_name  不允许为空 并且在表中必须唯一
      },
    },
    user_account: {
      // 定义 用户账号 字段为 字符串类型  不允许为空 并且在表中必须唯一
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true, // 验证器，确保 user_account 不为空字符串
      },
    },
    user_password: {
      // 定义 用户密码 字段为 字符串类型  不允许为空 并且在表中必须唯一
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true, // 验证器，确保 user_password 不为空字符串
      },
    },
    user_role: {
      // 定义 用户名称 字段为 字符串类型  不允许为空
      type: DataTypes.STRING,
      allowNull: false,
    },
    role_id: {
      // 定义 用户角色 字段为 字符串类型  不允许为空
      type: DataTypes.UUID,
      allowNull: false,
    },
    department_name: {
      // 定义 部门名称 字段为 字符串类型  不允许为空
      type: DataTypes.STRING,
      allowNull: false,
    },
    department_id: {
      // 定义 用户部门 字段为 字符串类型  不允许为空
      type: DataTypes.UUID,
      allowNull: false,
    },
    // 定义 特权 字段为 布尔  false
    is_protected: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
  },
  {
    sequelize, // 指向已经实例化的 Sequelize 实例
    modelName: "SystemUser", // 设置在 Sequelize 中使用的模型名称
    tableName: "system_users", // 设置对应的数据库表名称
    timestamps: true, // 启用 Sequelize 的时间戳功能，自动添加 createdAt 和 updatedAt 字段
    // 钩子 (Hooks) 允许在生命周期事件发生时执行自定义逻辑
    hooks: {
      beforeCreate: (user, option) => {
        // console.log(user);
        // console.log(option);
      },
    },
  }
);

module.exports = SystemUser;
