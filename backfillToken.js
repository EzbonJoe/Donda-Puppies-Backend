require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/userModel.js"); // adjust path if needed

(async () => {
  try {
    // connect to DB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");

    // update all users missing tokenVersion
    const result = await User.updateMany(
      { tokenVersion: { $exists: false } },
      { $set: { tokenVersion: 0 } }
    );

    console.log(`✅ Backfill complete. Modified ${result.modifiedCount} users`);

    mongoose.connection.close();
  } catch (err) {
    console.error("❌ Error backfilling tokenVersion:", err);
    mongoose.connection.close();
  }
})();