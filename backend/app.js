const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 3300;
require("./helpers/dbCon")
const adminRoutes = require("./routes/adminRoutes")

// Common middleware
app.use(cors());
app.use(express.json());

// Index route
app.get("/", (req, res) => {
  res.json({ data: "This is a home page" });
});

// User routes middleware
app.use('/api/users', adminRoutes)

// Bind the connection and listen
app.listen(PORT, () => {
  console.log(`Server started at Port ${PORT}`);
});
