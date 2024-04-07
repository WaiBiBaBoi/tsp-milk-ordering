const express = require("express");
const router = express.Router();
const { Delivery, Order } = require("../../database/index");
const General = require("../general/index");
const { list, add, edit, del } = General(Delivery);
const { Op } = require("../../database/index");
const { jwtTokne } = require("../../tool/index");

router.get("/selete-list", (req, res) => {
  const whereCondition = Object.keys(req.query).reduce((acc, key) => {
    acc[key] = { [Op.like]: `%${req.query[key]}%` };
    return acc;
  }, {});
  Delivery.findAll({
    where: whereCondition,
  })
    .then((result) => {
      res.json({
        code: "0000",
        message: "查询成功",
        data: result,
      });
    })
    .catch((err) => {
      res.json({
        code: "500",
        message: "查询异常",
        err: err,
      });
    });
});

router.post("/login", (req, res) => {
  console.log(req.body);
  Delivery.findOne({
    raw: true,
    attributes: ["id", "department_id"],
    where: req.body,
  })
    .then((result) => {
      if (result) {
        let token = jwtTokne(result);
        res.json({
          code: "0000",
          message: "登录成功",
          data: {
            token,
          },
        });
      } else {
        res.json({
          code: "1001",
          message: "账号或密码有误",
          data: null,
        });
      }
    })
    .catch((err) => {
      res.json({
        code: "500",
        message: "操作异常",
        data: err,
      });
    });
});

router.get("/info", async (req, res) => {
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  try {
    const { count } = await Order.findAndCountAll({
      where: {
        id: req.user.id,
        order_status: {
          [Op.in]: [5, 6, 7, 8, 9], // 筛选状态为1和4的数据
        },
        createdAt: {
          [Op.gte]: firstDayOfMonth, // 大于等于当前月份的第一天
          [Op.lte]: lastDayOfMonth, // 小于等于当前月份的最后一天
        },
      },
      // 可以添加其他查询选项，如排序、关联等
    });

    const result = await Delivery.findOne({
      id: req.user.id,
      attributes: ["delivery_name", "performance"],
    });
    res.json({
      code: "0000",
      message: "操作成功",
      data: {
        delivery_name:result.delivery_name,
        performance:result.performance,
        monthPerformance:count
      },
    });
  } catch (err) {
    res.json({
      code: "500",
      message: "操作异常",
      data: err,
    });
  }
});

router.get("/list", (req, res) => {
  list(req, res);
});

router.post("/add", (req, res) => {
  req.body.department_id = req.user.department_id;
  add(req, res);
});

router.put("/edit", (req, res) => {
  edit(req, res);
});

router.delete("/delete", (req, res) => {
  del(req, res);
});
module.exports = router;
