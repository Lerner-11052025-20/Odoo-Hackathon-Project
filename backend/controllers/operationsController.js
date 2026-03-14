const Receipt = require('../models/Receipt');
const Delivery = require('../models/Delivery');
const Adjustment = require('../models/Adjustment');
const Product = require('../models/Product');

const generateReference = (prefix) => {
  return `${prefix}-${Math.floor(1000 + Math.random() * 9000)}-${Date.now().toString().slice(-4)}`;
};

const validateStock = async (products, isDeduction) => {
  for (const item of products) {
    const product = await Product.findById(item.product);
    if (!product) throw new Error(`Product not found`);
    if (isDeduction && product.stock < item.quantity) {
      throw new Error(`Insufficient stock for ${product.name}`);
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

exports.createReceipt = async (req, res, next) => {
  try {
    const receipt = await Receipt.create({
      ...req.body,
      reference: generateReference('REC')
    });
    res.status(201).json({ success: true, data: receipt });
  } catch (error) { next(error); }
};

exports.updateReceipt = async (req, res, next) => {
  try {
    const receipt = await Receipt.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data: receipt });
  } catch (error) { next(error); }
};

exports.deleteReceipt = async (req, res, next) => {
  try {
    const receipt = await Receipt.findById(req.params.id);
    if (receipt.status === 'Done') return res.status(400).json({ success: false, message: 'Cannot delete a processed receipt' });
    await receipt.remove();
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

exports.createDelivery = async (req, res, next) => {
  try {
    await validateStock(req.body.products, true);
    const delivery = await Delivery.create({
      ...req.body,
      reference: generateReference('DEL')
    });
    res.status(201).json({ success: true, data: delivery });
  } catch (error) { next(error); }
};

exports.updateDelivery = async (req, res, next) => {
  try {
    const delivery = await Delivery.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
    
    res.status(200).json({ success: true, data: delivery });
  } catch (error) { next(error); }
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
    res.status(201).json({ success: true, data: adjustment });
  } catch (error) { next(error); }
};

exports.updateAdjustment = async (req, res, next) => {
  try {
    const adjustment = await Adjustment.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
    
    res.status(200).json({ success: true, data: adjustment });
  } catch (error) { next(error); }
};
