const Users = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.createUser = async (req, res, next) => {
  try {
    const { userName, email, passWord, phoneNumber } = req.body;
    const saltrounds = 10;
    bcrypt.hash(passWord, saltrounds, async (err, hash) => {
      await Users.create({ userName, email, passWord: hash, phoneNumber });
      return res.status(200).json({ success: true, message: "user created" });
    });
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      return res
        .status(500)
        .json({ success: false, message: "user already exists" });
    }
    return res
      .status(500)
      .json({ success: false, message: "failed to create user" });
  }
};

function generateAccessToken(id) {
  return jwt.sign({ userId: id }, "123456789");
}

exports.logIn = async (req, res, next) => {
  try {
    const searchUser = await Users.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (!searchUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found. Please Sign Up" });
    }

    bcrypt.compare(req.body.passWord, searchUser.passWord, (err, result) => {
      if (err) {
        throw new Error("something went wrong");
      }
      if (result === true) {
        return res.status(200).json({
          success: true,
          message: "login successful",
          token: generateAccessToken(searchUser.id),
          isPremiumUser: searchUser.isPremiumUser,
        });
      } else {
        return res
          .status(401)
          .json({ success: true, message: "user not authorized" });
      }
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "failed to login user" });
  }
};
