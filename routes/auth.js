const express = require("express");
const validateUser = require("../middleware/validateUser");
const User = require("../models/userModel");

const router = express.Router();

router.post("/signup", (req, res) => {
  let { email, name, password } = req.body;

  // removing white space from our data using the trim method
  //to enable proper validation

  if (!email.trim() || !name.trim() || !password.trim()) {
    return res.send("fill in correct details");
  }

  const user = new User({ email, name, password });
  user
    .save()
    .then((user) =>
      res.json({
        message: `${user.name} signed up`,
      })
    )
    .catch((err) => {
      console.log(err.message);
      return res.send(err.message);
    });
});

router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email.trim() || !password.trim()) {
    return res.send("fill in correct details");
  }

  // Load user details from your password DB.

  User.findOne({ email })
    .then((user) => {
      user.validatePassword(
        user.password,
        password,
        function (error, isAMatch) {
          if (error) {
            return res.json(err);
          }
          user.generateToken(user, (err, user) => {
            if (err) {
              return res.json(err);
            }

            // storing our user token in a cookie
            res.cookie("urcookie", user.token, {
              maxAge: 90000,
              httpOnly: true,
            });

            return res.json({
              message: `${user.name} signed in`,
            });
          });
        }
      );
    })
    .catch((err) => console.log(err));
});

router.get("/signout", validateUser, (req, res) => {
  res.cookie("urcookie",{maxAge: 0});
  User.findByIdAndUpdate(req.user._id, { token: "" })
    .then((user) => {
      return res.send("you've signed out");
    })
    .catch((err) => res.send(err));
});

module.exports = router;
