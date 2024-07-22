const express = require("express");
const path = require("path");

const app = express();

// Serve the Angular app from the dist/second-website directory
app.use(express.static(path.join(__dirname, "/teachGenie/frontend")));

// Serve the index.html for all routes to support Angular's routing
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/teachGenie/frontend/index.html"));
  // res.send("Here")
});

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
