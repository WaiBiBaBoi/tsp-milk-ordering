// token 验证中间件
const jwt = require('jsonwebtoken')
const SECRET_KEY = 'your-secret-key' // 生产环境中应该更安全，且存储在环境变量中

module.exports = (req, res, nuxt) => {
  const token = req.get('token') || req.get('milk-token');
  console.log(token,'---------------')
  if (token) {
    jwt.verify(token, SECRET_KEY, (err, result) => {
      if (err) {
        return res.json({
          code: '403',
          msg: 'token失效',
          data: null,
        })
      }
      req.user = result
      nuxt()
    })
  } else {
    return res.json({
      code: '401',
      msg: 'token为空',
      data: null,
    })
  }
}


