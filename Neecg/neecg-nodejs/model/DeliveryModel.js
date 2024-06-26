/** 配送员
 * id: uuid
 * department_id: uuid // 部门id
 * delivery_name: string
 * delivery_account: string
 * delivery_password: string
 * performance: integer // 业绩
 * phone: string // 联系方式
 */

const { Model, DataTypes } = require("sequelize");
// 导入数据实例
const sequelize = require("../database/database");
const Department = require("./SystemDepartmentModel");
class Delivery extends Model {}
// 初始化 SystemRole 模型，定义其结构和设置
Delivery.init({
  // 定义 id 字段 自动生成 uuid 并设置为主键
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  department_id: {
    type: DataTypes.UUID,
    references: {
      model: Department,
      key: 'id'
    },
    allowNull: false,
  },
  delivery_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  delivery_account: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true, // 验证器，确保 delivery_account  不允许为空 并且在表中必须唯一
    },
  },
  delivery_password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    },
  },
  performance: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  state:{
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  sequelize, // 指向已经实例化的 Sequelize 实例
  modelName: "Delivery", // 设置在 Sequelize 中使用的模型名称
  tableName: "delivery", // 设置对应的数据库表名称
  timestamps: true, // 启用 Sequelize 的时间戳功能，自动添加 createdAt 和 updatedAt 字段
  // 钩子 (Hooks) 允许在生命周期事件发生时执行自定义逻辑
  hooks: {
    beforeCreate: (user, option) => {
      // console.log(user);
      // console.log(option);
    },
  },
});

module.exports = Delivery;
