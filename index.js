const express = require("express");
const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://botanicalCoder:mongopassword@cluster0.gltnq.mongodb.net/boilerplateyoutube?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useFindAndModify: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    }
  )
  .then(console.log("db connected"))
  .catch((err) => console.log(err));

const port = process.env.PORT || 5000;
const app = express();

app.get("/", (req, res) => {
  res.send("hello bitches");
});

app.listen(port, () => {
  console.log("app is listening on port " + port);
});
