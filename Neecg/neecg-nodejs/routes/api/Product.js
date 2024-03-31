const express = require("express");
const router = express.Router();
const { getPagination } = require("../../tool/index");
const { Op } = require("../../database/index");
const { Product, Commodity, Comment, User } = require("../../database/index");
const General = require("../general/index");
const { list, add, edit, del } = General(Product);

Comment.belongsTo(User, {
  foreignKey: "user_id",
  targetKey: "id",
  as: "user",
});

Product.hasMany(Commodity, {
  foreignKey: "product_id",
  as: "commoditys",
});

Product.hasMany(Comment, {
  foreignKey: "product_id",
  as: "comments",
});

router.get("/getProductListv2", (req, res) => {
  let { limit, offset } = getPagination(req.query.pageNo, req.query.pageSize);
  delete req.query.pageNo;
  delete req.query.pageSize;
  Product.findAll({
    limit: limit,
    offset: offset,
    where: req.body,
    include: [
      {
        model: Commodity,
        as: "commoditys",
      },
      {
        model: Comment,
        attributes: ["id"],
        as: "comments",
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
      message: "操作异常",
      data: err,
    });
  });
});

router.get("/getProductList", (req, res) => {
  let { limit, offset } = getPagination(req.query.pageNo, req.query.pageSize);
  delete req.query.pageNo;
  delete req.query.pageSize;
  // 构建模糊查询条件
  //Object.keys 获取 searchParams 对象所有的键。然后用 reduce 方法累加器构建 Sequelize 需要的查询条件格式。
  const whereCondition = Object.keys(req.query).reduce((acc, key) => {
    acc[key] = { [Op.like]: `%${req.query[key]}%` };
    return acc;
  }, {});
  Product.findAll({
    limit: limit,
    offset: offset,
    where: whereCondition,
    include: [
      {
        model: Commodity,
        as: "commoditys",
      },
      {
        model: Comment,
        attributes: ["id"],
        as: "comments",
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
      message: "操作异常",
      data: err,
    });
  });
});

router.get("/getProduct", (req, res) => {
  const { id } = req.query;
  Product.findOne({
    where: {
      id: id,
    },
    include: [
      {
        model: Commodity,
        as: "commoditys",
      },
      {
        model: Comment,
        include: {
          model: User,
          as: "user",
          attributes: ["id", "user_name", "avatar"],
        },
        as: "comments",
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
      message: "操作异常",
      data: err,
    });
  });
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