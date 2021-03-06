const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

module.exports = {
  login: (req, res, _next) => {
    User.findOne({ email: req.body.email })
      .exec()
      .then(user => {
        if (user.length < 1) {
          return res.status(401).json({
            message: "Auth failed"
          });
        }

        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
          if (err) {
            return res.status(401).json({
              message: "Auth failed"
            });
          }

          if (result) {
            const token = jwt.sign(
              {
                email: user[0].email,
                userId: user[0].email
              },
              process.env.JWT_KEY,
              {
                expiresIn: "1h"
              }
            );
            return res.status(200).json({
              message: "Auth successful",
              token: token
            });
          }

          res.status(401).json({
            message: "Auth failed"
          });
        });
      })
      .catch(err => {
        res.status(500).json({ error: err });
      });
  },

  signUp: (req, res, _next) => {
    User.find({ email: req.body.email })
      .exec()
      .then(user => {
        if (user.length >= 1) {
          return res.status(409).json({
            message: "Email already exists"
          });
        } else {
          bcrypt.hash(req.body.password, 12, (err, hash) => {
            if (err) {
              return res.status(500).json({ error: err });
            } else {
              const user = new User({
                email: req.body.email,
                password: hash
              });

              user
                .save()
                .then(result => {
                  console.log(result);
                  res.status(201).json({ message: "User created" });
                })
                .catch(err => {
                  res.status(500).json({ error: err });
                });
            }
          });
        }
      });
  },
  delete: (req, res, _next) => {
    User.deleteOne({ _id: req.params.userId })
      .exec()
      .then(_result => {
        res.status(200).json({
          message: "User removed"
        });
      })
      .catch(err => {
        res.status(500).json({ error: err });
      });
  }
};
