require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3500;
const cors = require("cors");
const mongoose = require("mongoose");
const connectDB = require("./config/dbConnect");
const corsOption = require("./config/corsOption");

connectDB();

// cors middleware
app.use(cors(corsOption));
// url middleware
app.use(express.urlencoded({ extended: false }));

// json middleware
app.use(express.json());

// route
app.use("/api/v1", require("./routes/auth"));
app.use("/api/v1", require("./routes/users"));
app.use("/api/v1", require("./routes/products"));
app.use("/api/v1", require("./routes/cart"));
app.use("/api/v1", require("./routes/order"));
app.use("/api/v1", require("./routes/stripe"));

mongoose.connection.once("open", () => {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:3500`);
  });
});
