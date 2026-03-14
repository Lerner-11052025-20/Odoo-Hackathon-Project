const Receipt = require('../models/Receipt');
const Delivery = require('../models/Delivery');
const Adjustment = require('../models/Adjustment');
const Product = require('../models/Product');
const { createNotification } = require('./notificationController');
const { syncMoves, updateMoveStatus, deleteMoves } = require('./moveController');

const generateReference = (prefix) => {
  return `${prefix}-${Math.floor(1000 + Math.random() * 9000)}-${Date.now().toString().slice(-4)}`;
};

const validateStock = async (products, isDeduction) => {
  for (const item of products) {
    const product = await Product.findById(item.product);
    if (!product) {
      const err = new Error(`Product not found`);
      err.status = 400;
      throw err;
    }
    if (isDeduction && product.stock < item.quantity) {
      const err = new Error(`Insufficient stock for "${product.name}". Available: ${product.stock}, Requested: ${item.quantity}`);
      err.status = 400;
      throw err;
    }
  }
};


const updateStock = async (products, multiplier) => {
  for (const item of products) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: item.quantity * multiplier }
    });
  }
};

// ================= RECEIPTS =================

exports.getReceipts = async (req, res, next) => {
  try {
    const receipts = await Receipt.find().populate('products.product', 'name sku unit').sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: receipts });
  } catch (error) { next(error); }
};

exports.getReceiptById = async (req, res, next) => {
  try {
    const receipt = await Receipt.findById(req.params.id)
      .populate('products.product', 'name sku unit')
      .populate('createdBy', 'name loginId');
    if (!receipt) return res.status(404).json({ success: false, message: 'Receipt not found' });
    res.status(200).json({ success: true, data: receipt });
  } catch (error) { next(error); }
};

exports.createReceipt = async (req, res, next) => {
  try {
    const receipt = await Receipt.create({
      ...req.body,
      reference: generateReference('REC')
    });
    
    await syncMoves({
      operationId: receipt._id,
      reference: receipt.reference,
      movementType: 'RECEIPT',
      products: receipt.products,
      status: receipt.status || 'Draft',
      fromLocation: receipt.supplier || 'Vendor',
      toLocation: receipt.warehouse || 'Warehouse',
      warehouse: receipt.warehouse
    });

    await createNotification({
      title: 'New Receipt Drafted',
      message: `New receipt ${receipt.reference} has been created for supplier ${receipt.supplier}.`,
      type: 'RECEIPT_CREATED',
      relatedModule: 'receipts',
      referenceId: receipt._id,
      onModel: 'Receipt',
      createdBy: req.user ? req.user._id : null
    });

    res.status(201).json({ success: true, data: receipt });
  } catch (error) { next(error); }
};

exports.updateReceipt = async (req, res, next) => {
  try {
    const receipt = await Receipt.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
    await syncMoves({
      operationId: receipt._id,
      reference: receipt.reference,
      movementType: 'RECEIPT',
      products: receipt.products,
      status: receipt.status || 'Draft',
      fromLocation: receipt.supplier || 'Vendor',
      toLocation: receipt.warehouse || 'Warehouse',
      warehouse: receipt.warehouse
    });

    res.status(200).json({ success: true, data: receipt });
  } catch (error) { next(error); }
};

exports.deleteReceipt = async (req, res, next) => {
  try {
    const receipt = await Receipt.findById(req.params.id);
    if (receipt.status === 'Done') return res.status(400).json({ success: false, message: 'Cannot delete a processed receipt' });
    await receipt.deleteOne();
    
    await deleteMoves(req.params.id);

    res.status(200).json({ success: true, data: {} });
  } catch (error) { next(error); }
};

exports.validateReceipt = async (req, res, next) => {
  try {
    const receipt = await Receipt.findById(req.params.id);
    if (!receipt) return res.status(404).json({ success: false, message: 'Not found' });
    if (receipt.status === 'Done') return res.status(400).json({ success: false, message: 'Already processed' });
    
    await updateStock(receipt.products, 1); // Increase stock
    receipt.status = 'Done';
    await receipt.save();
    
    await updateMoveStatus(receipt._id, 'Done');
    
    // Notification
    await createNotification({
      title: 'Receipt Validated',
      message: `Receipt ${receipt.reference} has been validated and stock updated.`,
      type: 'RECEIPT_CREATED',
      relatedModule: 'receipts',
      referenceId: receipt._id,
      onModel: 'Receipt',
      createdBy: req.user ? req.user._id : null
    });

    res.status(200).json({ success: true, data: receipt });
  } catch (error) { next(error); }
};

// ================= DELIVERIES =================

exports.getDeliveries = async (req, res, next) => {
  try {
    const deliveries = await Delivery.find().populate('products.product', 'name sku unit').sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: deliveries });
  } catch (error) { next(error); }
};

exports.getDeliveryById = async (req, res, next) => {
  try {
    const delivery = await Delivery.findById(req.params.id)
      .populate('products.product', 'name sku unit')
      .populate('createdBy', 'name loginId');
    if (!delivery) return res.status(404).json({ success: false, message: 'Delivery not found' });
    res.status(200).json({ success: true, data: delivery });
  } catch (error) { next(error); }
};

exports.createDelivery = async (req, res, next) => {
  try {
    await validateStock(req.body.products, true);
    const delivery = await Delivery.create({
      ...req.body,
      reference: generateReference('DEL')
    });
    
    await syncMoves({
      operationId: delivery._id,
      reference: delivery.reference,
      movementType: 'DELIVERY',
      products: delivery.products,
      status: delivery.status || 'Draft',
      fromLocation: delivery.warehouse || 'Warehouse',
      toLocation: delivery.customer || 'Customer',
      warehouse: delivery.warehouse
    });

    await createNotification({
      title: 'New Delivery Created',
      message: `Delivery ${delivery.reference} has been assigned for customer ${delivery.customer}.`,
      type: 'DELIVERY_CREATED',
      relatedModule: 'deliveries',
      referenceId: delivery._id,
      onModel: 'Delivery',
      createdBy: req.user ? req.user._id : null
    });

    res.status(201).json({ success: true, data: delivery });
  } catch (error) {
    // Return 400 for stock/validation errors, 500 for unexpected
    const status = error.status || 500;
    return res.status(status).json({ success: false, message: error.message || 'Failed to create delivery' });
  }
};

exports.updateDelivery = async (req, res, next) => {
  try {
    const delivery = await Delivery.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
    await syncMoves({
      operationId: delivery._id,
      reference: delivery.reference,
      movementType: 'DELIVERY',
      products: delivery.products,
      status: delivery.status || 'Draft',
      fromLocation: delivery.warehouse || 'Warehouse',
      toLocation: delivery.customer || 'Customer',
      warehouse: delivery.warehouse
    });

    res.status(200).json({ success: true, data: delivery });
  } catch (error) { next(error); }
};

exports.validateDelivery = async (req, res, next) => {
  try {
    const delivery = await Delivery.findById(req.params.id);
    if (!delivery) return res.status(404).json({ success: false, message: 'Not found' });
    if (delivery.status === 'Done') return res.status(400).json({ success: false, message: 'Already processed' });
    
    await validateStock(delivery.products, true);
    await updateStock(delivery.products, -1); // Decrease stock
    delivery.status = 'Done';
    await delivery.save();
    
    await updateMoveStatus(delivery._id, 'Done');
    
    // Notification & low stock check
    await createNotification({
      title: 'Delivery Validated',
      message: `Delivery ${delivery.reference} has been validated and stock reduced.`,
      type: 'DELIVERY_CREATED',
      relatedModule: 'deliveries',
      referenceId: delivery._id,
      onModel: 'Delivery',
      createdBy: req.user ? req.user._id : null
    });

    // Low stock check
    for (const item of delivery.products) {
      const p = await Product.findById(item.product);
      if (p.stock < 10) { // simple threshold
        await createNotification({
          title: 'Low Stock Alert',
          message: `${p.name} stock is critically low (${p.stock} remaining).`,
          type: 'LOW_STOCK',
          userRole: 'all',
          relatedModule: 'stock',
          referenceId: p._id,
          onModel: 'Product'
        });
      }
    }

    res.status(200).json({ success: true, data: delivery });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({ success: false, message: error.message || 'Failed to validate delivery' });
  }
};

// ================= ADJUSTMENTS =================

exports.getAdjustments = async (req, res, next) => {
  try {
    const adjustments = await Adjustment.find().populate('products.product', 'name sku unit').sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: adjustments });
  } catch (error) { next(error); }
};

exports.createAdjustment = async (req, res, next) => {
  try {
    const adjustment = await Adjustment.create({
      ...req.body,
      reference: generateReference('ADJ')
    });

    await syncMoves({
      operationId: adjustment._id,
      reference: adjustment.reference,
      movementType: 'ADJUSTMENT',
      products: adjustment.products.map(p => ({ product: p.product, difference: p.difference })),
      status: adjustment.status || 'Draft',
      fromLocation: adjustment.warehouse,
      toLocation: 'Virtual Loss/Gain',
      warehouse: adjustment.warehouse
    });

    await createNotification({
      title: 'New Inventory Adjustment',
      message: `An adjustment ${adjustment.reference} was created and is pending validation.`,
      type: 'ADJUSTMENT_MADE',
      relatedModule: 'adjustments',
      referenceId: adjustment._id,
      onModel: 'Adjustment',
      createdBy: req.user ? req.user._id : null
    });

    res.status(201).json({ success: true, data: adjustment });
  } catch (error) { next(error); }
};

exports.updateAdjustment = async (req, res, next) => {
  try {
    const adjustment = await Adjustment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
    await syncMoves({
      operationId: adjustment._id,
      reference: adjustment.reference,
      movementType: 'ADJUSTMENT',
      products: adjustment.products.map(p => ({ product: p.product, difference: p.difference })),
      status: adjustment.status || 'Draft',
      fromLocation: adjustment.warehouse,
      toLocation: 'Virtual Loss/Gain',
      warehouse: adjustment.warehouse
    });

    res.status(200).json({ success: true, data: adjustment });
  } catch (error) { next(error); }
};

exports.validateAdjustment = async (req, res, next) => {
  try {
    const adjustment = await Adjustment.findById(req.params.id);
    if (!adjustment) return res.status(404).json({ success: false, message: 'Not found' });
    if (adjustment.status === 'Done') return res.status(400).json({ success: false, message: 'Already processed' });
    
    // Process each adjustment directly
    for (const item of adjustment.products) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.difference }
      });
    }
    
    adjustment.status = 'Done';
    await adjustment.save();

    await updateMoveStatus(adjustment._id, 'Done');

    // Notification
    await createNotification({
      title: 'Inventory Adjustment Made',
      message: `Adjustment ${adjustment.reference} was completed.`,
      type: 'ADJUSTMENT_MADE',
      relatedModule: 'adjustments',
      referenceId: adjustment._id,
      onModel: 'Adjustment',
      createdBy: req.user ? req.user._id : null
    });
    
    res.status(200).json({ success: true, data: adjustment });
  } catch (error) { next(error); }
};
