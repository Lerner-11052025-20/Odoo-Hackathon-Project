const Transfer = require('../models/Transfer');
const Product  = require('../models/Product');

const genRef = () => `TRF-${Math.floor(1000 + Math.random() * 9000)}-${Date.now().toString().slice(-4)}`;

/* ══════════════════════════════════════════
   GET /api/transfers
   ?search=&status=&warehouse=
══════════════════════════════════════════ */
exports.getTransfers = async (req, res, next) => {
  try {
    const { search = '', status = '', warehouse = '' } = req.query;
    const filter = {};

    if (status)    filter.status = status;
    if (warehouse) filter.$or = [{ fromWarehouse: warehouse }, { toWarehouse: warehouse }];
    if (search) {
      filter.$or = [
        { reference:     { $regex: search, $options: 'i' } },
        { fromWarehouse: { $regex: search, $options: 'i' } },
        { toWarehouse:   { $regex: search, $options: 'i' } },
        { fromLocation:  { $regex: search, $options: 'i' } },
        { toLocation:    { $regex: search, $options: 'i' } },
        { notes:         { $regex: search, $options: 'i' } },
      ];
    }

    const transfers = await Transfer.find(filter)
      .populate('product', 'name sku unit warehouse')
      .populate('validatedBy', 'loginId')
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, data: transfers });
  } catch (err) { next(err); }
};

/* ══════════════════════════════════════════
   GET /api/transfers/:id
══════════════════════════════════════════ */
exports.getTransfer = async (req, res, next) => {
  try {
    const transfer = await Transfer.findById(req.params.id)
      .populate('product', 'name sku unit warehouse stock')
      .populate('validatedBy', 'loginId')
      .lean();
    if (!transfer) return res.status(404).json({ success: false, message: 'Transfer not found' });
    res.json({ success: true, data: transfer });
  } catch (err) { next(err); }
};

/* ══════════════════════════════════════════
   POST /api/transfers
══════════════════════════════════════════ */
exports.createTransfer = async (req, res, next) => {
  try {
    const { product, quantity, fromWarehouse, fromLocation, toWarehouse, toLocation, scheduledDate, notes } = req.body;

    // Validate required fields
    if (!product || !quantity || !fromWarehouse || !toWarehouse) {
      return res.status(400).json({ success: false, message: 'Product, quantity, source and destination warehouses are required.' });
    }

    // Same source & destination check
    if (fromWarehouse === toWarehouse && fromLocation === toLocation) {
      return res.status(400).json({ success: false, message: 'Source and destination cannot be the same.' });
    }

    // Validate product exists
    const prod = await Product.findById(product);
    if (!prod) return res.status(404).json({ success: false, message: 'Product not found.' });

    // Check available stock
    if (prod.stock < Number(quantity)) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock. Available: ${prod.stock} ${prod.unit}, Requested: ${quantity}`
      });
    }

    const transfer = await Transfer.create({
      reference: genRef(),
      product, quantity: Number(quantity),
      fromWarehouse, fromLocation: fromLocation || '',
      toWarehouse,   toLocation:   toLocation   || '',
      scheduledDate: scheduledDate || new Date(),
      notes: notes || '',
    });

    const populated = await transfer.populate('product', 'name sku unit warehouse');
    res.status(201).json({ success: true, data: populated });
  } catch (err) { next(err); }
};

/* ══════════════════════════════════════════
   PUT /api/transfers/:id
══════════════════════════════════════════ */
exports.updateTransfer = async (req, res, next) => {
  try {
    const transfer = await Transfer.findById(req.params.id);
    if (!transfer) return res.status(404).json({ success: false, message: 'Transfer not found' });
    if (['Done', 'Cancelled'].includes(transfer.status)) {
      return res.status(400).json({ success: false, message: `Cannot edit a ${transfer.status} transfer.` });
    }

    const { status, product, quantity, fromWarehouse, fromLocation, toWarehouse, toLocation, scheduledDate, notes } = req.body;

    const updated = await Transfer.findByIdAndUpdate(
      req.params.id,
      { status, product, quantity, fromWarehouse, fromLocation, toWarehouse, toLocation, scheduledDate, notes },
      { new: true, runValidators: true }
    ).populate('product', 'name sku unit warehouse');

    res.json({ success: true, data: updated });
  } catch (err) { next(err); }
};

/* ══════════════════════════════════════════
   DELETE /api/transfers/:id   (Manager only – only if Draft/Cancelled)
══════════════════════════════════════════ */
exports.deleteTransfer = async (req, res, next) => {
  try {
    const transfer = await Transfer.findById(req.params.id);
    if (!transfer) return res.status(404).json({ success: false, message: 'Transfer not found' });
    if (transfer.status === 'Done') {
      return res.status(400).json({ success: false, message: 'Cannot delete a completed transfer.' });
    }
    await Transfer.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Transfer deleted.' });
  } catch (err) { next(err); }
};

/* ══════════════════════════════════════════
   POST /api/transfers/validate/:id
   Moves stock: source product stock unchanged globally
   (internal transfer = same total; update warehouse label on product)
══════════════════════════════════════════ */
exports.validateTransfer = async (req, res, next) => {
  try {
    const transfer = await Transfer.findById(req.params.id).populate('product');
    if (!transfer) return res.status(404).json({ success: false, message: 'Transfer not found' });
    if (transfer.status === 'Done')       return res.status(400).json({ success: false, message: 'Transfer already completed.' });
    if (transfer.status === 'Cancelled')  return res.status(400).json({ success: false, message: 'Transfer was cancelled.' });

    const prod = transfer.product;
    if (!prod) return res.status(404).json({ success: false, message: 'Product not found.' });

    // Re-verify stock hasn't been consumed since creation
    if (prod.stock < transfer.quantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock. Available: ${prod.stock} ${prod.unit}, Needed: ${transfer.quantity}`
      });
    }

    // Internal transfer: total stock unchanged.
    // Update product's warehouse label to destination (reflects primary location).
    await Product.findByIdAndUpdate(prod._id, { warehouse: transfer.toWarehouse });

    // Mark validated
    transfer.status      = 'Done';
    transfer.validatedBy = req.user._id;
    transfer.validatedAt = new Date();
    await transfer.save();

    const populated = await Transfer.findById(transfer._id)
      .populate('product', 'name sku unit warehouse')
      .populate('validatedBy', 'loginId');

    res.json({ success: true, data: populated });
  } catch (err) { next(err); }
};
