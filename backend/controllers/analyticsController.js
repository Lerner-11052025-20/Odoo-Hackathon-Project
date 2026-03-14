const Product = require('../models/Product');
const Receipt = require('../models/Receipt');
const Delivery = require('../models/Delivery');
const Adjustment = require('../models/Adjustment');
const Transfer = require('../models/Transfer');
const Move = require('../models/Move');
const Warehouse = require('../models/Warehouse');
const mongoose = require('mongoose');

// @desc    Get dashboard analytics
// @route   GET /api/analytics/dashboard
// @access  Protected
exports.getDashboardAnalytics = async (req, res, next) => {
  try {
    const isAdmin = req.user.role === 'inventory_manager';

    // 1. Stock Status Distribution
    const stockStatus = await Product.aggregate([
      {
        $facet: {
          totalInStock: [
            { $match: { stock: { $gt: 10 } } },
            { $count: "count" }
          ],
          lowStock: [
            { $match: { $and: [{ stock: { $gt: 0 } }, { stock: { $lte: 10 } }] } },
            { $count: "count" }
          ],
          outOfStock: [
            { $match: { stock: 0 } },
            { $count: "count" }
          ]
        }
      },
      {
        $project: {
          distribution: [
            { name: "In Stock", value: { $ifNull: [{ $arrayElemAt: ["$totalInStock.count", 0] }, 0] }, color: "#10b981" },
            { name: "Low Stock", value: { $ifNull: [{ $arrayElemAt: ["$lowStock.count", 0] }, 0] }, color: "#f59e0b" },
            { name: "Out of Stock", value: { $ifNull: [{ $arrayElemAt: ["$outOfStock.count", 0] }, 0] }, color: "#ef4444" }
          ]
        }
      }
    ]);

    // 2. Warehouse Distribution (Stock per warehouse)
    const warehouseDist = await Product.aggregate([
      {
        $group: {
          _id: "$warehouse",
          totalQuantity: { $sum: "$stock" }
        }
      },
      {
        $project: {
          name: "$_id",
          value: "$totalQuantity"
        }
      },
      { $sort: { value: -1 } }
    ]);

    // 3. Movement Trends (Last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const movementTrends = await Move.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo },
          status: 'Done'
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            type: "$movementType"
          },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: "$_id.date",
          movements: {
            $push: {
              type: "$_id.type",
              count: "$count"
            }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // 4. Top Moving Products
    const topProducts = await Move.aggregate([
      { $match: { status: 'Done' } },
      {
        $group: {
          _id: "$product",
          moveCount: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'productInfo'
        }
      },
      { $unwind: "$productInfo" },
      {
        $project: {
          name: "$productInfo.name",
          moves: "$moveCount"
        }
      },
      { $sort: { moves: -1 } },
      { $limit: 5 }
    ]);

    // 5. Recent Activity (Wait for Staff/Manager differentiation)
    // For now simple count of today's operations
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const todayOps = await Move.countDocuments({
      createdAt: { $gte: startOfToday }
    });

    const pendingOps = await Promise.all([
      Receipt.countDocuments({ status: { $ne: 'Done' } }),
      Delivery.countDocuments({ status: { $ne: 'Done' } }),
      Adjustment.countDocuments({ status: { $ne: 'Done' } }),
      Transfer.countDocuments({ status: { $ne: 'Done' } })
    ]).then(([r, d, a, t]) => r + d + a + t);

    res.status(200).json({
      success: true,
      data: {
        stockDistribution: stockStatus[0].distribution,
        warehouseDistribution: warehouseDist,
        movementTrends,
        topProducts,
        summary: {
          todayOperations: todayOps,
          pendingTasks: pendingOps,
          totalProducts: await Product.countDocuments()
        }
      }
    });

  } catch (error) { next(error); }
};

// @desc    Get stock analytics
// @route   GET /api/analytics/stock
exports.getStockAnalytics = async (req, res, next) => {
  try {
    // 1. Category Distribution
    const categoryDist = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          totalStock: { $sum: "$stock" }
        }
      },
      {
        $project: {
          name: "$_id",
          value: "$count",
          stock: "$totalStock"
        }
      }
    ]);

    // 2. High vs Low Stock Products
    const stockLevels = await Product.find()
      .select('name stock category')
      .sort({ stock: -1 })
      .limit(10);

    const lowStockLevels = await Product.find({ stock: { $lte: 10 } })
      .select('name stock')
      .sort({ stock: 1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: {
        categoryDistribution: categoryDist,
        topProducts: stockLevels,
        lowStockProducts: lowStockLevels
      }
    });
  } catch (error) { next(error); }
};

// @desc    Get operations analytics
// @route   GET /api/analytics/operations
exports.getOperationsAnalytics = async (req, res, next) => {
  try {
    const { type } = req.query; // receipt, delivery, etc.

    // Status breakdown across all operations
    const statusBreakdown = await Promise.all([
      Receipt.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
      Delivery.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
      Adjustment.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
      Transfer.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }])
    ]);

    // Combine them
    const combinedStatus = {};
    ['Draft', 'Ready', 'Done', 'Cancelled', 'Waiting'].forEach(s => combinedStatus[s] = 0);

    statusBreakdown.flat().forEach(item => {
      if (combinedStatus[item._id] !== undefined) {
         combinedStatus[item._id] += item.count;
      }
    });

    const formattedStatus = Object.keys(combinedStatus).map(key => ({
      name: key,
      value: combinedStatus[key]
    }));

    // Operations Hub Activity (Receipts vs Deliveries) last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const movementTrends = await Move.aggregate([
        { $match: { createdAt: { $gte: thirtyDaysAgo } } },
        {
          $group: {
            _id: {
              date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
              type: "$movementType"
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { "_id.date": 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        statusDistribution: formattedStatus,
        movementTrends
      }
    });
  } catch (error) { next(error); }
};

// @desc    Get warehouse analytics
// @route   GET /api/analytics/warehouse
exports.getWarehouseAnalytics = async (req, res, next) => {
  try {
    // Stock by Warehouse
    const warehouseStock = await Product.aggregate([
      {
        $group: {
          _id: "$warehouse",
          totalStock: { $sum: "$stock" },
          productCount: { $sum: 1 }
        }
      },
      {
        $project: {
          name: "$_id",
          stock: "$totalStock",
          products: "$productCount"
        }
      }
    ]);

    // Most active warehouses (by Move count)
    const activeWarehouses = await Move.aggregate([
      { $group: { _id: "$warehouse", moves: { $sum: 1 } } },
      { $sort: { moves: -1 } },
      { $project: { name: "$_id", value: "$moves" } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        warehouseStock,
        activeWarehouses
      }
    });
  } catch (error) { next(error); }
};

// @desc    Get movement analytics
// @route   GET /api/analytics/movement
exports.getMovementAnalytics = async (req, res, next) => {
  try {
    const types = await Move.aggregate([
      { $group: { _id: "$movementType", value: { $sum: 1 } } },
      { $project: { name: "$_id", value: 1 } }
    ]);

    const dailyTrends = await Move.aggregate([
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } },
        { $limit: 30 },
        { $project: { date: "$_id", count: 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        typeDistribution: types,
        dailyTrends
      }
    });
  } catch (error) { next(error); }
};
