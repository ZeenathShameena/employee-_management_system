const mongoose = require('mongoose');

const holidaySchema = new mongoose.Schema({
  title: { type: String, required: true }, // e.g., "Independence Day"
  date: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Holiday = mongoose.model('Holiday', holidaySchema);
module.exports = Holiday;
