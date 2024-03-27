const express = require('express');
const router = express.Router();
const { sendMail, testimonial } = require('../../tool/email');

router.post('/email', async (req, res) => {
  const { email } = req.body;
  const code = testimonial.create();
  const mailOptions = {
    from: '牛奶订购系统邮件<1715281438@qq.com>',
    to: email,
    subject: '验证码',
    text: `本次验证码为：${code}，有效期10分钟。`
  };
  console.log(testimonial);
  try {
    await sendMail(mailOptions);
    res.json({
      message: '发送成功，请注意留意邮箱。',
    });
  } catch(err) {
    res.json({
      message: '发送失败。',
      data: err
    });
  }
})

// 测试验证码用的接口
router.post('/existe', (req, res) => {
  const { code } = req.body;
  if (testimonial.existe(code)) {
    res.json({
      message: '验证码正确',
    });
  } else {
    res.json({
      message: '验证码错误',
    });
  }
});

module.exports = router