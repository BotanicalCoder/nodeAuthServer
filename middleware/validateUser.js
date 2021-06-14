const  User  = require("../models/userModel");

let validateUser = (req, res, next) => {
  let urcookie = "urcookie";
  let token = req.cookies.urcookie;

  User.validateToken(token, (err, user) => {
    if (err) {
      throw err;
    }
    if (!user) {
      return res.json({
        isAuth: false,
        error: true,
      });
    }

    req.token = token;
    req.user = user;
    next()
  });
};


module.exports = validateUser;

