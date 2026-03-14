const Product = require('../models/Product');

exports.getKPIs = async (req, res, next) => {
  try {
    // Aggregate real data from Product model
    const totalProducts = await Product.countDocuments();
    const lowStock = await Product.countDocuments({ stock: { $gt: 0, $lte: 20 } });
    const outOfStock = await Product.countDocuments({ stock: { $lte: 0 } });

    // Calculate Products added in the last 24h as 'Receipts' for Operations Summary
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    const recentReceipts = await Product.countDocuments({ createdAt: { $gte: oneDayAgo } });

    const kpis = {
      totalProducts: { value: totalProducts, trend: totalProducts > 0 ? 5 : 0, status: totalProducts > 0 ? 'up' : 'neutral' },
      lowStock: { value: lowStock, trend: lowStock > 0 ? -1 : 0, status: lowStock > 0 ? 'down' : 'neutral' },
      outOfStock: { value: outOfStock, trend: 0, status: outOfStock > 0 ? 'down' : 'neutral' },
      pendingReceipts: { value: recentReceipts, trend: recentReceipts > 0 ? 2 : 0, status: recentReceipts > 0 ? 'up' : 'neutral' },
      pendingDeliveries: { value: 14, trend: 4, status: 'up' },     // Mock until Operations Delivery module exists
      internalTransfers: { value: 5, trend: 0, status: 'neutral' }  // Mock until Operations Transfer module exists
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
    
    // Initialize last 7 days
    const activityData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      activityData.push({
        name: days[d.getDay()],
        dateStr: d.toISOString().split('T')[0],
        in: 0,
        out: Math.floor(Math.random() * 20), // Mock outgoing Deliveries for visual purposes
        amt: 0
      });
    }

    // Fetch products created in the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const recentProducts = await Product.find({ createdAt: { $gte: sevenDaysAgo } });

    recentProducts.forEach(p => {
      const pDate = new Date(p.createdAt).toISOString().split('T')[0];
      const targetDay = activityData.find(d => d.dateStr === pDate);
      if (targetDay) {
        // Add the stock to the incoming chart line
        targetDay.in += (p.stock || 1);
        targetDay.amt += (p.stock || 1);
      }
    });

    res.status(200).json({ success: true, data: activityData });
  } catch (error) {
    next(error);
  }
};

exports.getRecentOperations = async (req, res, next) => {
  try {
    // Fetch latest 6 products added to simulate recent operations (Receipts) for the Dashboard
    const recentProducts = await Product.find().sort({ createdAt: -1 }).limit(6);
    
    const recentOperations = recentProducts.map(p => ({
      id: `REC-${p.sku.substring(0, 5)}`,
      type: 'Receipt',
      product: p.name,
      warehouse: p.warehouse,
      quantity: p.stock,
      status: 'Done',
      timestamp: p.createdAt || new Date()
    }));

    // Return the generated operations list
    res.status(200).json({ success: true, data: recentOperations });
  } catch (error) {
    next(error);
  }
};
