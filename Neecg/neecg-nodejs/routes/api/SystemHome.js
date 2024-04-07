const express = require("express");
const router = express.Router();
const { Order } = require("../../database/index");

const Sequelize = require("sequelize");
const { Op } = Sequelize;

// 总销售额
router.get("/totalSales", async (req, res) => {
  try {
    const totalSales = await Order.sum("total_price");
    res.json({
      code: "0000",
      message: "查询成功",
      totalSales: totalSales || 0,
    });
  } catch (err) {
    res.json({
      code: "500",
      message: "查询异常",
      err: err,
    });
  }
});

// 日销售额
router.get("/dailySales", async (req, res) => {
  const today = new Date();
  const startOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const endOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 1,
  );

  try {
    const dailySales = await Order.sum("total_price", {
      where: {
        createdAt: {
          [Op.between]: [startOfDay, endOfDay],
        },
      },
    });
    res.json({
      code: "0000",
      message: "查询成功",
      dailySales: dailySales || 0,
    });
  } catch (err) {
    res.json({
      code: "500",
      message: "查询异常",
      err: err,
    });
  }
});

// 总订单量
router.get("/totalOrderQuantity", async (req, res) => {
  try {
    const totalSales = await Order.count();
    res.json({
      code: "0000",
      message: "查询成功",
      totalSales: totalSales,
    });
  } catch (err) {
    res.json({
      code: "500",
      message: "查询异常",
      err: err,
    });
  }
});

// 总成功订单量
router.get("/totalSuccessfulOrders", async (req, res) => {
  try {
    const totalSales = await Order.count({
      where: {
        order_status: 6,
      },
    });
    res.json({
      code: "0000",
      message: "查询成功",
      totalSales: totalSales,
    });
  } catch (err) {
    res.json({
      code: "500",
      message: "查询异常",
      err: err,
    });
  }
});

// 一周内销售额
router.get("/weeklySales", async (req, res) => {
  try {
    // 获取一周前的日期
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 6);

    const weeklySales = await Order.findAll({
      attributes: [
        [Sequelize.fn("DATE", Sequelize.col("createdAt")), "order_date"],
        [Sequelize.fn("SUM", Sequelize.col("total_price")), "total_sales"],
      ],
      where: {
        createdAt: {
          [Op.gte]: oneWeekAgo, // 大于等于一周前的日期
        },
      },
      limit: 7,
      group: [Sequelize.fn("DATE", Sequelize.col("createdAt"))],
      raw: true,
    });

    const echartsData = {
      xAxisData: [],
      seriesData: [],
    };

    let currentDate = new Date(oneWeekAgo);
    const dates = new Array(7).fill(0).map((_) => {
      const data = currentDate.toLocaleDateString();
      currentDate.setDate(currentDate.getDate() + 1);
      return data;
    }).reverse();

    const serieData = dates.map((_, index) => {
      return weeklySales[index] ? weeklySales[index].total_sales : "0";
    });
    echartsData.xAxisData = dates.reverse();
    echartsData.seriesData = serieData.reverse();

    res.json({
      code: "0000",
      message: "查询成功",
      data: echartsData,
    });
  } catch (err) {
    res.json({
      code: "500",
      message: "查询异常",
      err: err,
    });
  }
});

// 一周内10个商品销售榜
router.get("/weeklyMerchandiseSales", async (req, res) => {
  try {
    // 获取一周前的日期
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 6);

    // 查询一周内的订单数据
    const salesData = await Order.findAll({
      attributes: [
        'commodity_name', // 选择商品名称列
        [Sequelize.fn('SUM', Sequelize.col('quantity')), 'totalSales'], // 计算每天的总销售数量
      ],
      where: {
        createdAt: {
          [Op.gte]: oneWeekAgo, // 大于等于一周前的日期
        },
      },
      group: [
        'commodity_name'
      ],
      order: [[Sequelize.fn("SUM", Sequelize.col("quantity")), "DESC"]],
      raw: true, // 返回原始数据，不包装成实例对象
      limit: 10, // 获取前 10 个商品的销售数据
    });

    const names = salesData.map(item => {
      return item.commodity_name;
    });

    const values = salesData.map(item => {
      return item.totalSales;
    });

    const echartsData = {
      xAxisData: names,
      seriesData: values,
    };

    res.json({
      code: "0000",
      message: "查询成功",
      data: echartsData
    });
  } catch (err) {
    res.json({
      code: "500",
      message: "查询异常",
      err: err,
    });
  }
});

// 一周内的销售订单量
router.get("/calculateWeeklySales", async (req, res) => {
  try {
    // 获取一周前的日期
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 6);

    // 查询一周内的订单数量
    const orders = await Order.findAll({
      raw: true,
      attributes: [
        [Sequelize.fn('date', Sequelize.col('createdAt')), 'date'],
        [Sequelize.fn('count', Sequelize.col('id')), 'count'],
      ],
      where: {
        createdAt: {
          [Op.gte]: oneWeekAgo, // 大于等于一周前的日期
        },
      },
      group: [Sequelize.fn('date', Sequelize.col('createdAt'))],
      order: [[Sequelize.fn('date', Sequelize.col('createdAt')), 'DESC']],
    });

    const dates = new Array(7).fill(null).map((_, index) => {
      const date = oneWeekAgo.toLocaleDateString();
      oneWeekAgo.setDate(oneWeekAgo.getDate() + 1);
      return date;
    });

    const values = new Array(7).fill(null).map((_, index) => {
      return orders[index] ? orders[index].count : 0;
    }).reverse();

    const echartsData = {
      xAxisData: dates,
      seriesData: values,
    };

    res.json({
      code: "0000",
      message: "查询成功",
      data: echartsData
    });
  } catch (err) {
    res.json({
      code: "500",
      message: "查询异常",
      err: err,
    });
  }
});

// 总10个商品的销售榜
router.get("/allProductSalesTrends", async (req, res) => {
  try {
    const salesData = await Order.findAll({
      attributes: [
        "commodity_name",
        [Sequelize.fn("SUM", Sequelize.col("quantity")), "quantity"],
      ],
      group: ["commodity_name"],
      order: [[Sequelize.fn("SUM", Sequelize.col("quantity")), "DESC"]],
      limit: 10, // 获取前 10 个商品的销售数据
    });

    const names = salesData.map(item => {
      return item.commodity_name;
    });

    const values = salesData.map(item => {
      return item.quantity;
    });

    const echartsData = {
      xAxisData: names,
      seriesData: values,
    };

    res.json({
      code: "0000",
      message: "查询成功",
      data: echartsData,
    });
  } catch (err) {
    res.json({
      code: "500",
      message: "查询异常",
      err: err,
    });
  }
});

module.exports = router;
