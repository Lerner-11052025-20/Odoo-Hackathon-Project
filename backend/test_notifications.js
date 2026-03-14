const mongoose = require('mongoose');
const Notification = require('./models/Notification');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/coreinventory', {
}).then(async () => {
  try {
    const notifs = await Notification.find();
    console.log('Notifications found:', notifs.length);
    console.log(notifs);
  } catch (err) {
    console.error('Error:', err.message);
  }
  process.exit(0);
}).catch(err => {
  console.error("DB connection error:", err);
  process.exit(1);
});
