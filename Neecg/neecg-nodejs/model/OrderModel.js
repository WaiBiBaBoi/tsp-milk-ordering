/**
 * id: uuid
 * user_id: uuid // 客户id
 * product_id: uuid // 产品id
 * commodity_id: uuid // 商品id
 * delivery_id: uuid // 配送员id
 * salesman_id: uuid // 业务员id
 * receiver: string // 收货人
 * phone: string // 联系方式
 * address: string // 收货地址
 * total_price: decimal // 总价
 * quantity: integer // 数量
 * // 订单状态: 0 已下单，1 已接单，2 配送中，3 配送完成，4 确认收货，5 退换申请中，6 退换成功，7 退换失败
 * order_status: integer 
 * return_message: text // 退换信息
 * create_at: datetime
 * update_at: datetime
 */

const { Model, DataTypes } = require("sequelize");
// 导入数据实例
const sequelize = require("../database/database");
const User = require("./UserModel");
const Product = require("./ProductModel");
const Commodity = require("./CommodityModel");
const Delivery = require("./DeliveryModel");
const Salesman = require("./SalesmanModel");
class Order extends Model {}
// 初始化 SystemRole 模型，定义其结构和设置
Order.init({
  // 定义 id 字段 自动生成 uuid 并设置为主键
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.UUID,
    references: {
      model: User,
      key: 'id'
    },
    allowNull: false,
  },
  product_id: {
    type: DataTypes.UUID,
    references: {
      model: Product,
      key: 'id'
    },
    allowNull: false,
  },
  product_name: {
    type: DataTypes.STRING,
  },
  commodity_id: {
    type: DataTypes.UUID,
    references: {
      model: Commodity,
      key: 'id'
    },
    allowNull: false,
  },
  commodity_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL,
    allowNull: false
  },
  image: {
    type: DataTypes.TEXT,
    defaultValue: ''
  },
  delivery_id: {
    type: DataTypes.UUID,
    references: {
      model: Delivery,
      key: 'id'
    },
  },
  salesman_id: {
    type: DataTypes.UUID,
    references: {
      model: Salesman,
      key: 'id'
    }
  },
  receiver: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  total_price: {
    type: DataTypes.DECIMAL,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  order_status: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  // 取消原因
  abort_reason:{
    type: DataTypes.TEXT
  },
  // 商家拒绝退换原因
  reject_reason:{
    type: DataTypes.TEXT
  },
  return_message: {
    type: DataTypes.TEXT
  },
  return_images:{
    type: DataTypes.TEXT
  }
}, {
  sequelize, // 指向已经实例化的 Sequelize 实例
  modelName: "Order", // 设置在 Sequelize 中使用的模型名称
  tableName: "order", // 设置对应的数据库表名称
  timestamps: true, // 启用 Sequelize 的时间戳功能，自动添加 createdAt 和 updatedAt 字段
  // 钩子 (Hooks) 允许在生命周期事件发生时执行自定义逻辑
  hooks: {
    beforeCreate: (user, option) => {
      // console.log(user);
      // console.log(option);
    },
  },
});

module.exports = Order;
