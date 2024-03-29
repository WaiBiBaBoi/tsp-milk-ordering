const express = require('express');
const router = express.Router();
const multer = require('multer'); // 引入multer中间件，它用于处理multipart/form-data类型的表单数据，主要用于上传文件。
const path = require('path'); // 引入path模块，它提供了一些实用功能，用来处理文件与目录的路径。

// multer.diskStorage用来设置如何处理文件上传的路径和文件名
const storage = multer.diskStorage({
  // destination是用来确定上传的文件应该存储在哪个文件夹内
  // 它可以设置为一个字符串或者一个函数
  // 如果是函数，它的参数是一个请求（req），一个包含了文件信息的对象（file）和一个回调函数（cb）
  destination: function (req, file, cb) {
    // 这里我们调用cb回调函数指定文件的上传目录
    // 'uploads/'是我们要将文件存储的目录
    cb(null, 'public/images');
  },
  // filename用来确定文件夹中的文件名的确定
  // 它也可以是一个字符串或一个函数
  filename: function (req, file, cb) {
    // 我们通常会随机命名文件以避免文件名冲突，因此这里我们将原始文件名和一个时间戳连接起来
    // path.extname(file.originalname)是原始文件的拓展名
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

// 使用配置好的storage实例创建multer对象
const upload = multer({ storage: storage });

// 在express路由中使用这个上传对象
// upload.single('file')表示是单文件上传，'file'是表单中file字段的name属性值
router.post('/file', upload.single('file'), (req, res) => {
  // 如果文件上传成功，req.file就会包含文件的详细信息
  if (req.file) {
    // 文件上传成功返回信息
    // res.json({ message: '文件上传成功', file: req.file });
    const fullUrl = (req.protocol + '://' + req.get('host') + '/' + req.file.path).replace('/public','');
    fullUrl
    // 返回包含完整文件路径的JSON
    res.json({ message: '文件上传成功', filePath: fullUrl });
  } else {
    // 如果没有文件被上传则返回错误
    res.status(400).send('文件上传失败');
  }
});
module.exports = router