### 项目执行步骤
1. 确保项目已经安装完依赖和创建完数据库后，先启动数据库服务
2. 再启动 `neecg-nodejs` 后端服务
3. 最后就是剩下的 `milk-ordering, neecg-admin, delivery`

### milk-ordering - 官网
`
安装依赖: npm install
`

`
启动项目: npm run dev
`

### Neecg - 后台管理系统跟后端服务代码
`
安装依赖: npm install
`

`
启动项目neecg-admin: npm run serve
`

`
启动项目neecg-nodejs: npm run start
`

### delivery - 配送员H5端
`
安装依赖: npm install
`

`
启动项目: npm run serve
`

### mysql 数据库配置
启动mysql服务后，创建一个连接，再创建一个名为 `neecg` 的数据库。

连接数据库配置可在 `neecg-nodejs/database/database.js` 查看

用户名和密码默认为 root
