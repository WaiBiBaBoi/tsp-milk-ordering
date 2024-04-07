// 导入 sequelize
const { Sequelize } = require("sequelize");

// 连接数据库
const sequelize = new Sequelize("neecg", "root", "root", {
  host: "127.0.0.1",
  dialect: "mysql",
  port: 3307,
  dialectOptions: {
    // 将时区设置为'+08:00'，这样从数据库检索的时间就是北京时间
    useUTC: false, // for reading from database
    dateStrings: true, // 避免时区转换
    typeCast: true, // 保证时间格式
  },
  timezone: "+08:00", // 为写入数据库的时间设置时区
});

module.exports = sequelize;
