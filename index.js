

//tutorial sample

// import express and mongoose
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");

//importing our auth route as auth
const auth = require("./routes/auth");
const validateUser = require("./middleware/validateUser");
// creates an instance of the express app and save in the app constant
const app = express();

//connect to mongoose

mongoose.connect(
  "mongodb+srv://userName:password@cluster0.gltnq.mongodb.net/databaseName?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
  },
  (err, something) => {
    if (err) {
      console.log(err);
    }
  }
);

//listen for the connection open event
mongoose.connection.on("open", (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("connected to database");
  }
});

// sets the port to the environment variable PORT but if the variable is not set we use 5000
const port = process.env.PORT || 5000;

// middleware that parses json
app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use("/api/user", auth);

// a route to / that returns an oject
app.get("/", (req, res) => {
  return res.send({ message: "welcome to the auth app " });
});

app.get("/userdetails", validateUser, (req, res) => {
  let { user } = req;
  return res.send(user);
});

// listen for requests made to our server on the specified port
app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
