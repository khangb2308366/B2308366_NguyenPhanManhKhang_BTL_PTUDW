const mongoose = require("mongoose");
async function connectDB() {
    try {
        await mongoose.connect("mongodb://localhost:27017/QLThuVien");
        console.log("✅ Connected MongoDB via Mongoose successfully!");
    } catch (error) {
        console.error("❌ MongoDB connection error: ", error);
        process.exit(1);
    }
}

module.exports = { connectDB };