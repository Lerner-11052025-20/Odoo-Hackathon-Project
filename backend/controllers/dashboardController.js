const Product = require('../models/Product');
const Receipt = require('../models/Receipt');
const Delivery = require('../models/Delivery');
const Adjustment = require('../models/Adjustment');
const Transfer = require('../models/Transfer');

exports.getKPIs = async (req, res, next) => {
  try {
    const totalProducts = await Product.countDocuments();
    const lowStock = await Product.countDocuments({ stock: { $gt: 0, $lte: 20 } });
    const outOfStock = await Product.countDocuments({ stock: { $lte: 0 } });

    // Real counts for Operations Summary
    const pendingReceipts = await Receipt.countDocuments({ status: { $in: ['Waiting', 'Ready'] } });
    const completedReceipts = await Receipt.countDocuments({ status: 'Done' });
    
    const pendingDeliveries = await Delivery.countDocuments({ status: { $in: ['Waiting', 'Ready'] } });
    const completedDeliveries = await Delivery.countDocuments({ status: 'Done' });
    
    const internalTransfers = await Transfer.countDocuments({ status: { $in: ['Draft', 'Ready', 'In Progress'] } });

    // Late Deliveries (Mock for now as we don't have strict scheduling comparison, or check if scheduledDate < today)
    const today = new Date();
    const lateDeliveries = await Delivery.countDocuments({ 
      status: { $in: ['Waiting', 'Ready'] },
      scheduledDate: { $lt: today }
    });

    const kpis = {
      totalProducts: { value: totalProducts, trend: 5, status: 'up' },
      lowStock: { value: lowStock, trend: -1, status: 'down' },
      outOfStock: { value: outOfStock, trend: 0, status: 'neutral' },
      pendingReceipts: { 
        value: pendingReceipts, 
        completed: completedReceipts,
        trend: 2, 
        status: 'up' 
      },
      pendingDeliveries: { 
        value: pendingDeliveries, 
        completed: completedDeliveries,
        late: lateDeliveries,
        trend: 4, 
        status: 'up' 
      },
      internalTransfers: { value: internalTransfers, trend: 0, status: 'neutral' }
    };
    
    res.status(200).json({ success: true, data: kpis });
  } catch (error) {
    next(error);
  }
};

exports.getActivity = async (req, res, next) => {
  try {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    
    
    const toLocalDateStr = (dateObj) => {
      const d = new Date(dateObj);
      const yyyy = d.getFullYear();
      let mm = d.getMonth() + 1;
      let dd = d.getDate();
      if (mm < 10) mm = '0' + mm;
      if (dd < 10) dd = '0' + dd;
      return `${yyyy}-${mm}-${dd}`;
    };

    const activityData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      activityData.push({
        name: days[d.getDay()],
        dateStr: toLocalDateStr(d),
        in: 0,
        out: 0,
        internal: 0,
        amt: 0
      });
    }

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    // Fetch Done Receipts in last 7 days
    const receipts = await Receipt.find({ 
      status: 'Done', 
      updatedAt: { $gte: sevenDaysAgo } 
    });

    receipts.forEach(r => {
      const rDate = toLocalDateStr(r.updatedAt);
      const targetDay = activityData.find(d => d.dateStr === rDate);
      if (targetDay) {
        const totalQty = r.products.reduce((acc, p) => acc + (p.quantity || 0), 0);
        targetDay.in += totalQty;
        targetDay.amt += totalQty;
      }
    });

    // Fetch Done Deliveries in last 7 days
    const deliveries = await Delivery.find({ 
      status: 'Done', 
      updatedAt: { $gte: sevenDaysAgo } 
    });

    deliveries.forEach(d => {
      const dDate = toLocalDateStr(d.updatedAt);
      const targetDay = activityData.find(day => day.dateStr === dDate);
      if (targetDay) {
        const totalQty = d.products.reduce((acc, p) => acc + (p.quantity || 0), 0);
        targetDay.out += totalQty;
      }
    });

    // Fetch Done Transfers in last 7 days
    const transfers = await Transfer.find({
      status: 'Done',
      updatedAt: { $gte: sevenDaysAgo }
    });
    
    transfers.forEach(t => {
      const tDate = toLocalDateStr(t.updatedAt);
      const targetDay = activityData.find(day => day.dateStr === tDate);
      if (targetDay) {
        const totalQty = t.quantity || 0;
        targetDay.internal += totalQty;
      }
    });

    res.status(200).json({ success: true, data: activityData });
  } catch (error) {
    next(error);
  }
};

exports.getRecentOperations = async (req, res, next) => {
  try {
    const [receipts, deliveries, adjustments, transfers] = await Promise.all([
      Receipt.find().sort({ createdAt: -1 }).limit(3).populate('products.product', 'name'),
      Delivery.find().sort({ createdAt: -1 }).limit(3).populate('products.product', 'name'),
      Adjustment.find().sort({ createdAt: -1 }).limit(3).populate('products.product', 'name'),
      Transfer.find().sort({ createdAt: -1 }).limit(3).populate('product', 'name')
    ]);

    const formattedReceipts = receipts.map(r => ({
      id: r.reference,
      type: 'Receipt',
      product: r.products[0]?.product?.name || 'Multiple Products',
      warehouse: r.warehouse,
      quantity: r.products.reduce((acc, p) => acc + p.quantity, 0),
      status: r.status,
      timestamp: r.createdAt
    }));

    const formattedDeliveries = deliveries.map(d => ({
      id: d.reference,
      type: 'Delivery',
      product: d.products[0]?.product?.name || 'Multiple Products',
      warehouse: d.warehouse,
      quantity: d.products.reduce((acc, p) => acc + p.quantity, 0),
      status: d.status,
      timestamp: d.createdAt
    }));

    const formattedAdjustments = adjustments.map(a => ({
      id: a.reference,
      type: 'Adjustment',
      product: a.products[0]?.product?.name || 'Adjustment',
      warehouse: a.warehouse,
      quantity: a.products.length,
      status: a.status,
      timestamp: a.createdAt
    }));
    
    const formattedTransfers = transfers.map(t => ({
      id: t.reference,
      type: 'Transfer',
      product: t.product?.name || 'Unknown Product',
      warehouse: `${t.fromWarehouse} → ${t.toWarehouse}`,
      quantity: t.quantity,
      status: t.status,
      timestamp: t.createdAt
    }));

    const recentOperations = [...formattedReceipts, ...formattedDeliveries, ...formattedAdjustments, ...formattedTransfers]
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 8);

    res.status(200).json({ success: true, data: recentOperations });
  } catch (error) {
    next(error);
  }
};
