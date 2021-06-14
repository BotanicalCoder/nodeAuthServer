// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

// const UserSchema = mongoose.Schema({
//   name: { type: String, maxlength: 50 },
//   email: {
//     type: String,
//     trim: true,
//     unique: 1,
//   },
//   password: {
//     type: String,
//     minlength: 5,
//   },
//   lastname: {
//     type: String,
//     maxlength: 50,
//   },
//   role: {
//     type: Number,
//     default: 0,
//   },
//   token: {
//     type: String,
//   },
//   tokenExp: {
//     type: Number,
//   },
// });

// UserSchema.pre("save", function (next) {
//   let user = this;
//   if (user.isModified("password")) {
//     bcrypt.genSalt(10, function (err, salt) {
//       if (err) {
//         return next(err);
//       }
//       bcrypt.hash(user.password, salt, function (err, hash) {
//         // Store hash in your password DB.
//         if (err) {
//           return next(err);
//         }
//         user.password = hash;
//         next();
//       });
//     });
//   } else {
//     next();
//   }
// });

// UserSchema.methods.comparePassword = function (plainPassword, cb) {
//   bcrypt.compare(plainPassword, this.password, (err, isMatch) => {
//     if (err) {
//       return cb(err);
//     }
//     cb(null, isMatch);
//   });
// };

// UserSchema.methods.generateToken = function (cb) {
//   var user = this;
//   var token = jwt.sign(user._id.toHexString(), "secretkey");

//   user.token = token;
//   user.save(function (err, user) {
//     if (err) {
//       return cb(err);
//     }
//     cb(null, user);
//   });
// };

// UserSchema.static.findByToken = function (token, cb) {
//   let user = this;

//   jwt.verify(token, "secretkey", function (err, decode) {
//     user.findOne({ _id: decode, token }, (err, UserInfo) => {
//       if (err) {
//         return cb(err);
//       }
//       cb(null, UserInfo);
//     });
//   });
// };

// UserSchema.pre("save", function (next) {
//   let user = this;

//   // only hash the password if it has been modified (or is new)
//   if (!user.isModified("password")) {
//     return next();
//   }

//   //create a salt
//   bcrypt.genSalt(10, (err, salt) => {
//     if (err) {
//       return next(err);
//     }

//     //hash the salted password using the generated salt
//     bcrypt.hash(user.password, salt, (err, hash) => {
//       if (err) {
//         return next(err);
//       }
//       user.password = hash;
//       return next();
//     });
//   });
// });

// UserSchema.methods.generateToken = function (cb) {
//   let user = this;
//   let token = jwt.sign(user._id.toHexString(), "secretkey");
//   user.token = token;

//   user.save(function (err) {
//     if (err) {
//       return cb(err);
//     } else {
//       cb(null, user);
//     }
//   });
// };

// UserSchema.methods.comparePassword = function (plainPassword, cb) {
//   bcrypt.compare(plainPassword, this.password, (err, isMatch) => {
//     if (err) {
//       return cb(err);
//     }
//     return cb(null, isMatch);
//   });
// };

// const User = mongoose.model("user", UserSchema);

// module.exports = User;

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = mongoose.Schema({
  name: { type: String, maxlength: 50 },
  email: {
    type: String,
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
    minlength: 5,
  },
  token: {
    type: String,
  },
});

UserSchema.pre("save", function (next) {
  // do stuff
  let user = this;
  if (user.isModified("password")) {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        return next(err);
      }

      bcrypt.hash(user.password, salt, (err, hashedPassword) => {
        if (err) {
          return next(err);
        }
        user.password = hashedPassword;

        next();
      });
    });
  } else {
    next();
  }
});

UserSchema.methods.validatePassword = function (hashedPassword, password, cb) {
  bcrypt.compare(password, hashedPassword, function (err, res) {
    if (err) {
      cb(err);
    }
    cb(null, res);
  });
};

UserSchema.methods.generateToken = function (user, cb) {
  const token = jwt.sign({ id: user._id }, "jwtsecret");

  user.token = token;

  user
    .save()
    .then((user) => {
      cb(null, user);
    })
    .catch((err) => cb(err));
};

UserSchema.statics.validateToken = function (token, cb) {
  let user = this;
  jwt.verify(token, "jwtsecret", function (err, decoded) {
    if (err) {
      cb(err);
    }
    User
      .findById(decoded.id)
      .then((UserInfo) => {
        cb(null, UserInfo);
      })
      .catch((err) => cb(err));
  });
};

const User = mongoose.model("user", UserSchema);

module.exports = User;
