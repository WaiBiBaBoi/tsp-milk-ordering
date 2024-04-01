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

// 严选优质
router.get("/getBoutiqueProduct", (req, res) => {
  Product.findAll({
    limit: 6,
    where: {
      boutique: true
    },
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

// 最新上架产品
router.get("/getNewProductList", (req, res) => {
  Product.findAll({
    limit: 6,
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
    order: [
      ['createdAt', 'desc'],
    ]
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
  Product.findAndCountAll({
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
    order: [
      // 这里可以指定如何排序
      [{ model: Commodity, as: 'commoditys' }, 'createdAt', 'desc'], // 按订单日期降序
      [{ model: Comment, as: 'comments' }, 'createdAt', 'desc']  // 如果日期相同，则按金额升序
  ]
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
    order: [
      [{ model: Comment,as: 'comments' }, 'createdAt', 'desc'] // 按最新评论来排序
    ]
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
