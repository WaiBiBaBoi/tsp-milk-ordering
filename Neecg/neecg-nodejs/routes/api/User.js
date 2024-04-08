const express = require("express");
const router = express.Router();
const { User } = require("../../database/index");
const General = require("../general/index");
const { list, add, edit, del } = General(User);
const { testimonial } = require("../../tool/email");
const { jwtTokne } = require("../../tool/index");
const stripe = require("stripe")(
  "sk_test_51P2EzoBdEIPiPoJT8T5lModHlRaRwWKG9LnynzmETEz6UC5jy7PeA89A0h14YSD0oK0QmrizHRf5DRcBeZyzzlUV00wOxxcGFi"
);
// 验证验证码
const codeIsExist = (req, res, next) => {
  const { code } = req.body;
  if (!testimonial.existe(code, false)) {
    res.json({
      code: "1001",
      message: "验证码错误",
    });
    return;
  }
  next();
};

// 验证用户是否存在
const userIsExist = (req, res, next) => {
  User.findOne({
    where: {
      user_account: req.body.user_account,
    },
    attributes: ["user_account"],
  })
    .then((result) => {
      if (result) {
        res.json({
          code: "201",
          message: "用户已存在",
          data: null,
        });
        return;
      }
      // 删除验证码
      testimonial.existe(req.body.code);
      next();
    })
    .catch((err) => {
      res.json({
        code: "500",
        message: "用户查询异常",
        data: err,
      });
    });
};

// 注册
router.post("/register", codeIsExist, userIsExist, (req, res) => {
  const { user_account, user_password } = req.body;
  // 设置默认值头像
  if (!req.body.avatar) {
    req.body.avatar = `${req.protocol}://${req.get(
      "host"
    )}/images/default_avatar.jpg`;
  }
  User.create({
    user_name: Date.now().toString(),
    user_account,
    user_password,
    avatar: req.body.avatar,
  })
    .then((result) => {
      res.json({
        code: "0000",
        message: "注册成功",
      });
    })
    .catch((err) => {
      res.json({
        code: "1001",
        message: "注册失败",
        data: err,
      });
    });
});

// 登录
router.post("/login", (req, res) => {
  const { user_account, user_password } = req.body;
  User.findOne({
    raw: true,
    where: {
      user_account: user_account,
      user_password: user_password,
    },
  }).then((result) => {
    if (result) {
      const token = jwtTokne(result);
      res.cookie("milk-token", token).json({
        code: "0000",
        message: "登录成功!",
        data: result,
      });
    } else {
      res.json({
        code: "1001",
        message: "登录失败，账号或密码有误!",
        data: result,
      });
    }
  });
});
router.get("/info", (req, res) => {
  let id = req.user.id;
  User.findOne({
    where: {
      id,
    },
    attributes: ["user_name", "avatar", "money", "phone", "address"],
  })
    .then((result) => {
      res.json({
        code: "0000",
        message: "获取成功",
        data: result,
      });
    })
    .catch((err) => {
      res.json({
        code: "500",
        message: "操作异常",
        data: err,
      });
    });
});
//4242 4242 4242 4242 Webhook
router.get("/payment", async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (user) {
      user.money = Number(user.money) + 1000;
      await user.save();
    }
    // 下面的代码块用于创建一个Stripe支付会话
    // 创建价格对象
    const session = await stripe.checkout.sessions.create({
      // 指定支付方式，这里使用'card'即信用卡/借记卡支付
      payment_method_types: ["card"],
      // 定义购买的商品信息，这里是一个具有单个商品的数组
      line_items: [
        {
          price_data: {
            currency: "cny", // 设定货币为美元
            product_data: {
              name: "T-shirt", // 产品名字
            },
            unit_amount: 2000, // 产品单价，单位为货币的最小金额单位，这里是美分，所以2000表示20美元
          },
          quantity: 1, // 购买数量
        },
      ],
      // 设置支付模式为'payment'，表示这是一个一次性支付
      mode: "payment",
      // 支付成功后的回调URL，此处需替换为实际的页面URL
      success_url: "http://127.0.0.1:11451/user",
      // 用户取消支付后的回调URL，此处也需替换为实际的页面URL
      cancel_url: "http://127.0.0.1:11451/",
    });

    // 打印支付链接URL，用于调试或日志记录
    console.log("Payment Link URL:", session.url);

    // 将支付链接URL作为响应返回给调用者
    res.json({
      code: "0000", // 自定义的成功响应码
      message: "获取成功", // 响应消息
      data: session.url, // 将支付链接URL包含在响应数据中
    });
  } catch (error) {
    console.error("Error:", error);
  }
});

router.get("/list", (req, res) => {
  list(req, res);
});

router.post("/add", (req, res) => {
  add(req, res);
});

router.put("/edit", (req, res) => {
  req.body.id = req.user.id;
  edit(req, res);
});

router.delete("/delete", (req, res) => {
  del(req, res);
});

module.exports = router;
