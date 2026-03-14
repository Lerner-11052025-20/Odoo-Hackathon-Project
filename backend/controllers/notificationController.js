const Notification = require('../models/Notification');

// Helper function to create notifications from other controllers
const createNotification = async ({ title, message, type, userRole = 'all', relatedModule, referenceId = null, onModel = 'System', createdBy = null }) => {
  try {
    await Notification.create({
      title,
      message,
      type,
      userRole,
      relatedModule,
      referenceId,
      onModel,
      createdBy
    });
  } catch (error) {
    console.error('Failed to create notification', error);
  }
};

// ─────────────────────────────────────────
// @desc    Get notifications for logged in user
// @route   GET /api/notifications
// @access  Protected
// ─────────────────────────────────────────
const getNotifications = async (req, res, next) => {
  try {
    const { role, _id } = req.user;
    const { page = 1, limit = 20 } = req.query;

    const query = {
      $or: [
        { userRole: 'all' },
        { userRole: role }
      ]
    };

    if (role === 'inventory_manager') {
      // managers see everything
      delete query.$or;
    } else {
      // Staff only sees operational modules
      query.relatedModule = { $in: ['receipts', 'deliveries', 'adjustments', 'transfers'] };
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .populate('createdBy', 'name loginId')
      .lean();

    // Map isRead for the current user safely
    const mapped = notifications.map(n => {
      const readByArr = Array.isArray(n.readBy) ? n.readBy.map(id => id.toString()) : [];
      return {
        ...n,
        isRead: readByArr.includes(_id.toString())
      };
    });

    const total = await Notification.countDocuments(query);

    res.status(200).json({
      success: true,
      data: mapped,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit))
      }
    });

  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────
// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Protected
// ─────────────────────────────────────────
const markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    if (!notification.readBy.includes(req.user._id)) {
      notification.readBy.push(req.user._id);
      await notification.save();
    }

    res.status(200).json({ success: true, message: 'Notification marked as read' });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────
// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Protected
// ─────────────────────────────────────────
const markAllAsRead = async (req, res, next) => {
  try {
    const { role, _id } = req.user;
    
    const query = {
      $or: [
        { userRole: 'all' },
        { userRole: role }
      ],
      readBy: { $ne: _id }
    };

    if (role === 'inventory_manager') {
      delete query.$or;
      query.readBy = { $ne: _id };
    } else {
      // Staff only sees operational modules
      query.relatedModule = { $in: ['receipts', 'deliveries', 'adjustments', 'transfers'] };
    }

    await Notification.updateMany(query, {
      $push: { readBy: _id }
    });

    res.status(200).json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────
// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Protected
// ─────────────────────────────────────────
const deleteNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    // Usually only managers can delete, or users simply hide them for themselves. 
    // For simplicity, we actually delete from DB.
    await notification.deleteOne();
    
    res.status(200).json({ success: true, message: 'Notification deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  createNotification
};
