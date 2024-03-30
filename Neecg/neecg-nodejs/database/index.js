const sequelize = require("./database");
const { Op } = require("sequelize");
const SystemMenu = require("../model/SystemMenuModel");
const SystemUser = require("../model/SystmeUserModel");
const SystmeRole = require("../model/SystmeRoleModel");
const SystemDataDict = require("../model/SystemDataDictModel");
const SystemDataDictConfig = require("../model/SystemDataDictConfigModel");
const Carousel = require("../model/CarouselModel");
const User = require("../model/UserModel");
const Product = require("../model/ProductModel");
const Comment = require("../model/CommentModel");
const Commodity = require("../model/CommodityModel");

const db = (success, error = (err) => {
  console.error("无法连接到数据库:", err);
}) => {
  sequelize.authenticate().then(() => {
    console.log("数据库连接成功");
    sequelize.sync({ force: false }).then(() => {
      console.log("模型同步成功");
      success();
    }).catch((err) => {
      console.log("模型同步失败", err);
    });
  }).catch((err) => {
    error(err);
  });
};

module.exports = {
  db,
  Op,
  SystemMenu,
  SystemUser,
  SystmeRole,
  SystemDataDict,
  SystemDataDictConfig,
  Carousel,
  User,
  Product,
  Comment,
  Commodity,
};
