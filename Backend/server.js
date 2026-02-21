require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");

const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("✗ MONGO_URI is not defined in .env file");
  process.exit(1);
}

// Connect to MongoDB and start server
mongoose
  .connect(MONGO_URI) 
  .then(() => {
    console.log("✓ Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`✓ Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("✗ Database c  onnection failed:", err.message);
    process.exit(1);
  });
