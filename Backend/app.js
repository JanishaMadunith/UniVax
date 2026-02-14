<<<<<<< HEAD
// const express = require("express");
=======
const express = require("express");
const userRoutes = require("./Routes/Tharusha/UserRoutes");
>>>>>>> 2d9fddee0c06725c4e47070a13f404e9b0b32269

// const app = express();

// // Middleware
// app.use(express.json());

<<<<<<< HEAD
// // Routes
// app.use("/", (req, res) => {
//   res.send("Backend is working!");
// });
=======
// Routes
app.use("/users", userRoutes);
>>>>>>> 2d9fddee0c06725c4e47070a13f404e9b0b32269

// module.exports = app;