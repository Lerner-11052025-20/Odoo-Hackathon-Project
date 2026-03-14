const Location  = require('../models/Location');
const Warehouse = require('../models/Warehouse');
const { createNotification } = require('./notificationController');

/* ─────────────────────────────────────────────
   GET /api/locations
   ?search=rack&warehouse=<id>
───────────────────────────────────────────── */
exports.getLocations = async (req, res, next) => {
  try {
    const { search = '', warehouse = '' } = req.query;

    const filter = {};
    if (warehouse) filter.warehouse = warehouse;
    if (search) {
      filter.$or = [
        { name:        { $regex: search, $options: 'i' } },
        { code:        { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const locations = await Location.find(filter)
      .populate('warehouse', 'name code address')
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, data: locations });
  } catch (err) { next(err); }
};

/* ─────────────────────────────────────────────
   GET /api/locations/:id
───────────────────────────────────────────── */
exports.getLocation = async (req, res, next) => {
  try {
    const location = await Location.findById(req.params.id)
      .populate('warehouse', 'name code address')
      .lean();

    if (!location) return res.status(404).json({ success: false, message: 'Location not found' });
    res.json({ success: true, data: location });
  } catch (err) { next(err); }
};

/* ─────────────────────────────────────────────
   POST /api/locations
   Body: { name, code, warehouse, description }
───────────────────────────────────────────── */
exports.createLocation = async (req, res, next) => {
  try {
    const { name, code, warehouse, description } = req.body;

    if (!name || !code || !warehouse) {
      return res.status(400).json({ success: false, message: 'Name, Code, and Warehouse are required.' });
    }

    const warehouseExists = await Warehouse.findById(warehouse);
    if (!warehouseExists) {
      return res.status(404).json({ success: false, message: 'Warehouse not found.' });
    }

    const location = await Location.create({ name, code, warehouse, description });
    const populated = await location.populate('warehouse', 'name code address');

    await createNotification({
      title: 'Location Added',
      message: `Location "${location.name}" (${location.code}) was added to ${warehouseExists.name}.`,
      type: 'LOCATION_ADDED',
      userRole: 'inventory_manager',
      relatedModule: 'locations',
      referenceId: location._id,
      onModel: 'Location',
      createdBy: req.user ? req.user._id : null
    });

    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ success: false, message: 'Location code already exists in this warehouse.' });
    }
    next(err);
  }
};

/* ─────────────────────────────────────────────
   PUT /api/locations/:id
───────────────────────────────────────────── */
exports.updateLocation = async (req, res, next) => {
  try {
    const { name, code, warehouse, description } = req.body;

    const location = await Location.findByIdAndUpdate(
      req.params.id,
      { name, code, warehouse, description },
      { new: true, runValidators: true }
    ).populate('warehouse', 'name code address');

    if (!location) return res.status(404).json({ success: false, message: 'Location not found' });
    res.json({ success: true, data: location });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ success: false, message: 'Location code already exists in this warehouse.' });
    }
    next(err);
  }
};

/* ─────────────────────────────────────────────
   DELETE /api/locations/:id
───────────────────────────────────────────── */
exports.deleteLocation = async (req, res, next) => {
  try {
    const location = await Location.findByIdAndDelete(req.params.id);
    if (!location) return res.status(404).json({ success: false, message: 'Location not found' });
    res.json({ success: true, message: 'Location deleted.' });
  } catch (err) { next(err); }
};
