const Warehouse = require('../models/Warehouse');
const Location = require('../models/Location');
const { createNotification } = require('./notificationController');

/* ─────────────────────────────────────────
   WAREHOUSE CRUD
───────────────────────────────────────── */

// GET /api/warehouses   – list all + count locations per warehouse
exports.getWarehouses = async (req, res, next) => {
  try {
    const { search = '' } = req.query;
    const filter = search
      ? {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { code: { $regex: search, $options: 'i' } },
          { address: { $regex: search, $options: 'i' } },
        ]
      }
      : {};

    const warehouses = await Warehouse.find(filter).sort({ createdAt: -1 }).lean();

    // Attach location counts in one aggregation query
    const locationCounts = await Location.aggregate([
      { $group: { _id: '$warehouse', count: { $sum: 1 } } }
    ]);
    const countMap = {};
    locationCounts.forEach(l => { countMap[l._id.toString()] = l.count; });

    const result = warehouses.map(w => ({
      ...w,
      locationCount: countMap[w._id.toString()] || 0,
    }));

    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

// GET /api/warehouses/:id   – single warehouse + its locations
exports.getWarehouse = async (req, res, next) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id).lean();
    if (!warehouse) return res.status(404).json({ success: false, message: 'Warehouse not found' });

    const locations = await Location.find({ warehouse: req.params.id }).sort({ createdAt: -1 }).lean();

    res.json({ success: true, data: { ...warehouse, locations } });
  } catch (err) {
    next(err);
  }
};

// POST /api/warehouses
exports.createWarehouse = async (req, res, next) => {
  try {
    const { name, code, address } = req.body;
    if (!name || !code) return res.status(400).json({ success: false, message: 'Name and Code are required.' });


    // this is how getting us
    const existing = await Warehouse.findOne({ code: code.toUpperCase() });
    if (existing) return res.status(409).json({ success: false, message: `Code "${code.toUpperCase()}" already exists.` });

    const warehouse = await Warehouse.create({ name, code, address });

    await createNotification({
      title: 'Warehouse Created',
      message: `Warehouse "${warehouse.name}" (${warehouse.code}) was established.`,
      type: 'WAREHOUSE_CREATED',
      userRole: 'inventory_manager',
      relatedModule: 'warehouses',
      referenceId: warehouse._id,
      onModel: 'Warehouse',
      createdBy: req.user ? req.user._id : null
    });

    res.status(201).json({ success: true, data: { ...warehouse.toObject(), locationCount: 0 } });
  } catch (err) {
    next(err);
  }
};

// PUT /api/warehouses/:id
exports.updateWarehouse = async (req, res, next) => {
  try {
    const { name, code, address } = req.body;

    if (code) {
      const existing = await Warehouse.findOne({ code: code.toUpperCase(), _id: { $ne: req.params.id } });
      if (existing) return res.status(409).json({ success: false, message: `Code "${code.toUpperCase()}" already exists.` });
    }

    const warehouse = await Warehouse.findByIdAndUpdate(
      req.params.id,
      { name, code, address },
      { new: true, runValidators: true }
    ).lean();

    if (!warehouse) return res.status(404).json({ success: false, message: 'Warehouse not found' });

    const locationCount = await Location.countDocuments({ warehouse: req.params.id });
    res.json({ success: true, data: { ...warehouse, locationCount } });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/warehouses/:id
exports.deleteWarehouse = async (req, res, next) => {
  try {
    const warehouse = await Warehouse.findByIdAndDelete(req.params.id);
    if (!warehouse) return res.status(404).json({ success: false, message: 'Warehouse not found' });

    // Cascade delete locations
    await Location.deleteMany({ warehouse: req.params.id });

    res.json({ success: true, message: 'Warehouse deleted successfully.' });
  } catch (err) {
    next(err);
  }
};

/* ─────────────────────────────────────────
   LOCATION CRUD
───────────────────────────────────────── */

// GET /api/warehouses/:id/locations
exports.getLocations = async (req, res, next) => {
  try {
    const locations = await Location.find({ warehouse: req.params.id }).sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: locations });
  } catch (err) {
    next(err);
  }
};

// POST /api/warehouses/:id/locations
exports.createLocation = async (req, res, next) => {
  try {
    const { name, code, description } = req.body;
    if (!name || !code) return res.status(400).json({ success: false, message: 'Name and Code are required.' });

    const warehouseExists = await Warehouse.findById(req.params.id);
    if (!warehouseExists) return res.status(404).json({ success: false, message: 'Warehouse not found' });

    const location = await Location.create({ name, code, warehouse: req.params.id, description });
    res.status(201).json({ success: true, data: location });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ success: false, message: 'Location code already exists in this warehouse.' });
    }
    next(err);
  }
};

// PUT /api/locations/:locationId
exports.updateLocation = async (req, res, next) => {
  try {
    const { name, code, description } = req.body;
    const location = await Location.findByIdAndUpdate(
      req.params.locationId,
      { name, code, description },
      { new: true, runValidators: true }
    ).lean();
    if (!location) return res.status(404).json({ success: false, message: 'Location not found' });
    res.json({ success: true, data: location });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ success: false, message: 'Location code already exists in this warehouse.' });
    }
    next(err);
  }
};

// DELETE /api/locations/:locationId
exports.deleteLocation = async (req, res, next) => {
  try {
    const location = await Location.findByIdAndDelete(req.params.locationId);
    if (!location) return res.status(404).json({ success: false, message: 'Location not found' });
    res.json({ success: true, message: 'Location deleted.' });
  } catch (err) {
    next(err);
  }
};
