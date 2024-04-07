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
 * // 订单状态: 0 已下单，1，商家取消订单，2，用户取消订单，3 已接单，4 配送中，5 配送完成，6 确认收货，7 退换申请中，8 退换成功，9 退换失败
 * order_status: integer
 * return_message: text // 退换信息
 * create_at: datetime
 * update_at: datetime
 */

const express = require("express");
const router = express.Router();
const { getPagination } = require("../../tool/index");
const { Op } = require("../../database/index");
const { Order, Commodity, Product, User, Delivery, Salesman } = require(
  "../../database/index",
);
const General = require("../general/index");
const { list, add, edit, del } = General(Order);

Order.belongsTo(User, {
  foreignKey: "user_id",
  targetKey: "id",
  as: "user",
});

Order.belongsTo(Product, {
  foreignKey: "product_id",
  targetKey: "id",
  as: "product",
});

Order.belongsTo(Commodity, {
  foreignKey: "commodity_id",
  targetKey: "id",
  as: "commodity",
});

Order.belongsTo(Delivery, {
  foreignKey: "delivery_id",
  targetKey: "id",
  as: "delivery",
});

Order.belongsTo(Salesman, {
  foreignKey: "salesman_id",
  targetKey: "id",
  as: "salesman",
});

// 返回保留两位小数的价格
function formatPrice(price) {
  return Number((Math.floor(price * 100) / 100).toFixed(2));
}

// 下单
router.post("/purchasing", async (req, res) => {
  try {
    // 获取最新的user数据
    const user = await User.findOne({
      where: {
        id: req.user.id,
      },
    });
    // 获取最新的商品数据
    const commodity = await Commodity.findOne({
      where: {
        id: req.body.commodity_id,
      },
    });
   // 判断是否还有库存
    if (req.body.quantity > commodity.reserve) {
      res.json({
        code: "1000",
        message: "库存不足!",
      });
      return;
    }

    const { product_id, price } = commodity;

    const product = await Product.findOne({
      where: {
        id: product_id,
      },
    });
    // 计算出需要的钱
    const total_price = formatPrice(Number(price) * Number(req.body.quantity));
    if (user.money < total_price) {
      res.json({
        code: "1000",
        message: "购买失败，账户余额不足!",
      });
      return;
    }

    const money = formatPrice(Number(user.money) - total_price);

    // 创建订单表
    const create_res = await Order.create({
      user_id: user.id,
      product_id: product_id,
      commodity_id: commodity.id,
      total_price: total_price,
      quantity: req.body.quantity,
      order_status: 0, // 默认0
      receiver: req.body.receiver,
      phone: req.body.phone,
      address: req.body.address,
      product_name:product.product_name,
      commodity_name:commodity.commodity_name,
      price:commodity.price,
      image:commodity.images
    });
   
    if (create_res) {
      Product.findOne({
        where: {
          id: product_id,
        },
      }).then((product) => {
        // 更新产品销量
        product.sales_volume = Number(product.sales_volume) + req.body.quantity;
        // 更新商品库存
        commodity.reserve = Number(commodity.reserve) -
          Number(req.body.quantity);
        // 更新用户余额
        user.money = money;
        return Promise.all([user.save(), product.save(), commodity.save()]);
      }).then((result) => {
        if (result) {
          res.json({
            code: "0000",
            message: "下单成功!",
          });
        } else {
          res.json({
            code: "1000",
            message: "下单失败!",
          });
        }
      });
    }
  } catch (err) {
    res.json({
      err,
    });
  }
});
router.get("/orderList", (req, res) => {
  let { limit, offset } = getPagination(req.query.pageNo, req.query.pageSize);
  delete req.query.pageNo;
  delete req.query.pageSize;
  // 构建模糊查询条件
  //Object.keys 获取 searchParams 对象所有的键。然后用 reduce 方法累加器构建 Sequelize 需要的查询条件格式。
  const whereCondition = Object.keys(req.query).reduce((acc, key) => {
    acc[key] = { [Op.like]: `%${req.query[key]}%` };
    return acc;
  }, {});
  Order.findAndCountAll({
    limit: limit,
    offset: offset,
    where: whereCondition,
    order: [["createdAt", "desc"]],
    distinct: true,
    include: [
      {
        model: User,
        attributes: ["user_name"],
        as: "user",
      },
      // {
      //   model: Product,
      //   attributes: ["product_name", "department_id"],
      //   as: "product",
      // },
      // {
      //   model: Commodity,
      //   attributes: ["commodity_name", "price"],
      //   as: "commodity",
      // },
      {
        model: Delivery,
        as: "delivery",
      },
      {
        model: Salesman,
        as: "salesman",
      },
    ],
  }).then((result) => {
    res.json({
      code: "0000",
      message: "查询成功",
      data: result,
    });
  }).catch((err) => {
    res.json({
      code: "500",
      message: "查询异常",
      err: err,
    });
  });
});
// 用户当前订单
router.get("/userCurrentOrder", (req, res) => {
  // 构建模糊查询条件
  //Object.keys 获取 searchParams 对象所有的键。然后用 reduce 方法累加器构建 Sequelize 需要的查询条件格式。
  const whereCondition = Object.keys(req.query).reduce((acc, key) => {
    acc[key] = { [Op.like]: `%${req.query[key]}%` };
    return acc;
  }, {});
  Order.findAll({
    where: {
      ...whereCondition,
      order_status: {
        [Op.in]: [0, 3, 4, 5, 7], // 筛选状态为1和4的数据
      },
    },
    order: [["createdAt", "desc"]],
    distinct: true,
    include: [
      {
        model: User,
        attributes: ["user_name"],
        as: "user",
      },
      {
        model: Delivery,
        as: "delivery",
      },
      {
        model: Salesman,
        as: "salesman",
      },
    ],
  }).then((result) => {
    res.json({
      code: "0000",
      message: "查询成功",
      data: result,
    });
  }).catch((err) => {
    res.json({
      code: "500",
      message: "查询异常",
      err: err,
    });
  });
});
// 用户历史订单
router.get("/userHistoryOrder", (req, res) => {
  // 构建模糊查询条件
  //Object.keys 获取 searchParams 对象所有的键。然后用 reduce 方法累加器构建 Sequelize 需要的查询条件格式。
  const whereCondition = Object.keys(req.query).reduce((acc, key) => {
    acc[key] = { [Op.like]: `%${req.query[key]}%` };
    return acc;
  }, {});
  Order.findAll({
    where: {
      ...whereCondition,
      order_status:{
        [Op.in]: [1, 2, 6, 8,9 ], // 筛选状态为1和4的数据

      }
    },
    order: [["createdAt", "desc"]],
    distinct: true,
    include: [
      {
        model: User,
        attributes: ["user_name"],
        as: "user",
      },
      {
        model: Delivery,
        as: "delivery",
      },
      {
        model: Salesman,
        as: "salesman",
      },
    ],
  }).then((result) => {
    res.json({
      code: "0000",
      message: "查询成功",
      data: result,
    });
  }).catch((err) => {
    res.json({
      code: "500",
      message: "查询异常",
      err: err,
    });
  });
});
// 商家取消订单
router.put("/merchantCancelsOrder", async (req, res) => {
  try{
    const order = await Order.findByPk(req.body.id)
    order.order_status = 1
    order.abort_reason = req.body.abort_reason
    order.save()
    res.json({
      code: "0000",
      message: "操作成功",
      data: '',
    });
  }catch(err){
    res.json({
      code: "500",
      message: "查询异常",
      err: err,
    });
  }
});
// 用户取消订单
router.put("/userCancelsOrder", async (req, res) => {
  try{
    const order = await Order.findByPk(req.body.id)
    order.order_status = 2
    order.save()
    res.json({
      code: "0000",
      message: "操作成功",
      data: '',
    });
  }catch(err){
    res.json({
      code: "500",
      message: "查询异常",
      err: err,
    });
  }
});
// 商家接单
router.put("/confirmOrderAcceptance", async (req, res) => {
  try{
    const order = await Order.findByPk(req.body.id)
    order.delivery_id = req.body.delivery_id
    order.order_status = 3
    order.save()
    res.json({
      code: "0000",
      message: "操作成功",
      data: '',
    });
  }catch(err){
    res.json({
      code: "500",
      message: "查询异常",
      err: err,
    });
  }
});
// 配送员开始配送订单
router.put("/startDelivery", async (req, res) => {
  try{
    const order = await Order.findByPk(req.body.id)
    order.order_status = 4
    order.save()
    res.json({
      code: "0000",
      message: "操作成功",
      data: '',
    });
  }catch(err){
    res.json({
      code: "500",
      message: "查询异常",
      err: err,
    });
  }
});
// 配送员完成配送
router.put("/completeDelivery", async (req, res) => {
  try{
    const order = await Order.findByPk(req.body.id)
    order.order_status = 5
    order.save()
    res.json({
      code: "0000",
      message: "操作成功",
      data: '',
    });
  }catch(err){
    res.json({
      code: "500",
      message: "查询异常",
      err: err,
    });
  }
});
// 用户确认收货
router.put("/confirmReceipt", async (req, res) => {
  try{
    const order = await Order.findByPk(req.body.id)
    order.order_status = 6
    order.save()
    res.json({
      code: "0000",
      message: "操作成功",
      data: '',
    });
  }catch(err){
    res.json({
      code: "500",
      message: "查询异常",
      err: err,
    });
  }
});
// 用户退换申请
router.put("/returnApplication", async (req, res) => {
  try{
    const order = await Order.findByPk(req.body.id)
    order.order_status = 7
    order.return_images = req.body.return_images
    order.return_message = req.body.return_message
    order.save()
    res.json({
      code: "0000",
      message: "操作成功",
      data: '',
    });
  }catch(err){
    res.json({
      code: "500",
      message: "查询异常",
      err: err,
    });
  }
});
// 退换申请审核
router.put("/returnReview", async (req, res) => {
  try{
    const order = await Order.findByPk(req.body.id)
    order.order_status = req.body.status
    order.reject_reason = req.body.reject_reason || ''
    order.save()
    res.json({
      code: "0000",
      message: "操作成功",
      data: '',
    });
  }catch(err){
    res.json({
      code: "500",
      message: "查询异常",
      err: err,
    });
  }
});
router.get("/list", (req, res) => {
  list(req, res);
});

router.post("/add", (req, res) => {
  add(req, res);
});

router.put("/edit", (req, res) => {
  edit(req, res);
});

router.delete("/delete", (req, res) => {
  del(req, res);
});

module.exports = router;
