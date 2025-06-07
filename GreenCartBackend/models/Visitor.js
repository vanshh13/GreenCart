const mongoose = require("mongoose");

const VisitorSchema = new mongoose.Schema({
  date: { type: Date, required: true, unique: true },
  count: { type: Number, required: true },
  visitors: { type: [String], default: [] }, // Store unique visitor IPs
});

module.exports = mongoose.model("Visitor", VisitorSchema);
