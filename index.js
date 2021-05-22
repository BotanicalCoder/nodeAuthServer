// const cookieParser = require("cookie-parser");
// const express = require("express");
// const mongoose = require("mongoose");
// const User = require("./models/user");
// const bcrpt = require("bcryptjs");
// const auth = require("./middleware/auth");

// mongoose
//   .connect(
//     "mongodb+srv://botanicalCoder:mongopassword@cluster0.gltnq.mongodb.net/boilerplateyoutube?retryWrites=true&w=majority",
//     {
//       useNewUrlParser: true,
//       useFindAndModify: true,
//       useCreateIndex: true,
//       useUnifiedTopology: true,
//     }
//   )
//   .then(() => {})
//   .catch((err) => console.log(err));

// mongoose.connection
//   .on("open", () => {
//     console.log("db open");
//   })
//   .then()
//   .catch((err) => console.log(err));

// const port = process.env.PORT || 5000;
// const app = express();

// app.use(express.json());
// app.use(cookieParser());

// app.get("/api/users/auth", auth, (req, res) => {
//   res.status(200).json({
//     _id: req._id,
//     isAuth: true,
//     email: req.user.email,
//     name: req.user.name,
//     lastname: req.user.lastname,
//     role: req.user.role,
//   });
// });

// app.post("/api/users/register", (req, res) => {
//   const user = new User(req.body);
//   user
//     .save()
//     .then((userData) => {
//       return res.json(userData);
//     })
//     .catch((err) => console.log(err));
//   return res.status(201);
// });

// app.post("/api/user/login", (req, res) => {
//   User.findOne({ email: req.body.email })
//     .then((user) => {
//       user.comparePassword(req.body.password, (err, isMatch) => {
//         if (!isMatch) {
//           return res.json({
//             loginSuccess: false,
//             message: "auth failed",
//           });
//         }
//       });

//       user.generateToken((err, user) => {
//         if (err) {
//           return res.status(400).send(err);
//         }
//         res
//           .cookie("tcookie", user.token)
//           .status(200)
//           .json({ loginSuccess: true });
//       });
//     })
//     .catch((err) => {
//       console.log(err);

//       return res.json({
//         loginSuccess: false,
//         message: "auth failed",
//       });
//     });
// });

// app.get("/api/user/logout",auth, (req, res) => {
//   User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
//     if (err) {
//       return res.json({ success: false, err });
//     }
//     return res.status(200).json({
//       success: true,
//     });
//   });
// });
// app.listen(port, () => {
//   console.log("app is listening on port " + port);
// });

const express = require("express");
const mongoose = require("mongoose");

const app = express();

const User = require("../server/models/user");

const port = process.env.PORT || 5000;

app.use(express.json());

//connect to mongoose

mongoose.connect(
  "mongodb+srv://botanicalCoder:mongopassword@cluster0.gltnq.mongodb.net/boilerplateyoutube?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useFindAndModify: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  },
  (err, something) => {
    if (err) {
      console.log(err);
    }
  }
);

mongoose.connection.on("open", (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("connected to database");
  }
});

app.get("/", (req, res) => {
  res.send("hello world");
});

app.post("/api/user/signup", (req, res) => {
  //console.log(req.body);
  const { email, password } = req.body;
  const user = new User({ email, password });
  user
    .save()
    .then(() => {
      return res.send(req.body);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ " message ": "an error occured" });
    });
});

app.post("/api/user/login", (req, res) => {
  User.findOne({ email: req.body.email }).then((user) => {
    user.comparePassword(req.body.password, function(err, isMatch){
      if (err) {
        return res.json({
          message: "incorrect username or password",
        });
      } else {
        user.generateToken(function(err, user){
          if (err) {
            return res.json({
              message: "incorrect username or password",
            });
          }
          return res
            .cookie("cookie", user.token)
            .json({ message: "sign in successful" });
        });
      }
    });
  });
});

app.listen(port, () => {
  console.log("app listening on port " + port);
});
