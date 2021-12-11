const express = require("express");
const app = express();
const PORT = 3300;

// Index route
app.get("/", (req, res) => {
  res.json({ data: "This is a home page" });
});

// Bind the connection and listen
app.listen(PORT, () => {
  console.log(`Server started at Port ${PORT}`);
});
