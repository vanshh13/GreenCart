const Visitor = require("../models/Visitor");

const trackVisitor = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of the day

    const visitorIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress; // Get visitor's IP

    // Check if today's record exists
    let visitorRecord = await Visitor.findOne({ date: today });

    if (!visitorRecord) {
      // Create a new record with the first visitor
      visitorRecord = await Visitor.create({ date: today, count: 1, visitors: [visitorIP] });
    } else {
      // Check if this IP is already counted today
      if (!visitorRecord.visitors.includes(visitorIP)) {
        await Visitor.updateOne(
          { date: today },
          { $inc: { count: 1 }, $push: { visitors: visitorIP } }
        );
      }
    }

    next();
  } catch (error) {
    console.error("Error tracking visitor:", error);
    next();
  }
};

module.exports = trackVisitor;
