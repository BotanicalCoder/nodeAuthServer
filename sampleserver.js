const express = require("express");
const mongoose = require("mongoose");

const app = express();
const port = 5000 || process.env.PORT;

app.use(express.json());

app.get("/", (req, res) => {
  return res.send("welcome to my auth app");
});

app.listen(port, () => {
  `app listening on port ${port}`;
});
