if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const API_KEY = process.env.API_KEY;
const express = require("express");
const path = require("path");
const moment = require("moment");

const app = express();
const PORT = process.env.PORT || 5000;

// app.use(express.static(path.join(__dirname, "public")));
app.use(express.static("public"));
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
