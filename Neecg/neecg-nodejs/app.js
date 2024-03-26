// 引入错误处理模块
var createError = require('http-errors');
// 引入Express框架
var express = require('express');
// 引入路径处理模块
var path = require('path');
// 引入cookie解析中间件
var cookieParser = require('cookie-parser');
// 引入HTTP请求日志记录器
var logger = require('morgan');
// 引入CORS（跨源资源共享）中间件
const cors = require('cors');

// 引入自定义JWT Token验证中间件
const JwtTokenmidd = require('./midd/JwtTokenmidd');

// 引入API路由
const System = require('./routes/api/System');
const SystemMenu = require('./routes/api/SystemMenu');
const SystemUser = require('./routes/api/SystemUser');
const SystemRole = require('./routes/api/SystemRole');
const SystemPermission = require('./routes/api/SystemPermission');
const SystemDataDict = require('./routes/api/SystemDataDict');
const SystemDataDictConfig = require('./routes/api/SystemDataDictConfig');
const Upload = require('./routes/api/Upload');
const Carousel = require('./routes/api/Carousel');


// 创建Express应用
var app = express();

// 设置视图文件夹的路径
app.set('views', path.join(__dirname, 'views'));
// 设置视图引擎为ejs
app.set('view engine', 'ejs');

// 使用morgan将请求日志输出到控制台
app.use(logger('dev'));
// 解析JSON格式的请求体
app.use(express.json());
// 解析URL编码的请求体，extended: false表示使用核心模块querystring
app.use(express.urlencoded({ extended: false }));
// 使用cookieParser中间件来解析请求中的cookie
app.use(cookieParser());
// 设置静态文件夹的路径，如JavaScript、CSS或图片等
app.use(express.static(path.join(__dirname, 'public')));
// 应用CORS中间件允许跨域请求
app.use(cors());
// 设置路由以排除Token验证中间件的路径
const excludedPaths = ['/api/SystmeUser/login', '/api/carousel/list'];
// 自定义中间件，用于排除某些路径不用经过Token验证
app.use((req, res, next) => {
  if (excludedPaths.includes(req.path)) {
    // 如果请求路径在排除列表中，继续下一个中间件
    return next();
  }
  // 否则使用自定义的JWT Token验证中间件
  return JwtTokenmidd(req, res, next)
});

// 使用路由中间件，将特定的URL映射到对应的路由文件中
app.use('/api/System', System);
app.use('/api/SystemMenu', SystemMenu);
app.use('/api/SystmeUser', SystemUser);
app.use('/api/SystemRole', SystemRole);
app.use('/api/SystemPermission', SystemPermission);
app.use('/api/SystemDataDict', SystemDataDict);
app.use('/api/SystemDataDictConfig', SystemDataDictConfig);
app.use('/api/upload', Upload);
app.use('/api/Carousel', Carousel);


// 捕获404错误并转发到错误处理器
app.use(function(req, res, next) {
  next(createError(404));
});

// 统一错误处理中间件
app.use(function(err, req, res, next) {
  // 设置本地错误信息，仅在开发环境中提供错误信息
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // 渲染错误页面并设置错误状态码
  res.status(err.status || 500);
  res.render('error');
});

// 导出应用，通常用于模块化结构，便于测试和高级配置
module.exports = app;