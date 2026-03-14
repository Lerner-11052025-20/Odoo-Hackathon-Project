const Move = require('../models/Move');

// @desc    Get all move history logs
// @route   GET /api/moves
// @access  Protected
exports.getMoves = async (req, res, next) => {
  try {
    const { search = '', type, status, warehouse } = req.query;
    const filter = {};

    if (type) filter.movementType = type;
    if (status) filter.status = status;
    if (warehouse) filter.warehouse = warehouse;

    if (search) {
      filter.$or = [
        { reference: { $regex: search, $options: 'i' } },
        { fromLocation: { $regex: search, $options: 'i' } },
        { toLocation: { $regex: search, $options: 'i' } },
      ];
    }

    const moves = await Move.find(filter)
      .populate('product', 'name sku unit warehouse')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({ success: true, count: moves.length, data: moves });
  } catch (error) {
    next(error);
  }
};

// @desc    Helper to Sync multiple product movements for a single operation
exports.syncMoves = async ({ operationId, reference, movementType, products, status, fromLocation, toLocation, warehouse }) => {
  try {
    await Move.deleteMany({ operationId });

    if (!products || products.length === 0) return;

    const moves = products.map(p => {
      // For adjustments, we might have positive or negative. We use 'difference'. 
      let qty = p.quantity !== undefined ? p.quantity : (p.difference || 0);
      
      return {
        reference,
        operationId,
        product: p.product,
        quantity: qty,
        movementType,
        fromLocation,
        toLocation,
        warehouse,
        status
      };
    });

    await Move.insertMany(moves);
  } catch (error) {
    console.error(`Failed to sync moves for ${reference}:`, error);
  }
};

// @desc    Helper to update statuses
exports.updateMoveStatus = async (operationId, status) => {
  try {
    await Move.updateMany({ operationId }, { status });
  } catch (error) {
    console.error(`Failed to update move status for ${operationId}:`, error);
  }
};

// @desc    Helper to delete moves
exports.deleteMoves = async (operationId) => {
  try {
    await Move.deleteMany({ operationId });
  } catch (error) {
    console.error(`Failed to delete moves for ${operationId}:`, error);
  }
};
