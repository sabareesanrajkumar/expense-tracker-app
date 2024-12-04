const Users = require("../models/users");

exports.createUser = async (req, res, next) => {
  try {
    const newUser = await Users.create(req.body);
    return res.status(200).json({ success: true, message: "user created" });
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

exports.logIn = async (req, res, next) => {
  try {
    const searchUser = await Users.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (!searchUser) {
      return res
        .status(500)
        .json({ success: false, message: "User not found. Please Sign Up" });
    }

    if (searchUser.passWord !== req.body.passWord) {
      return res
        .status(500)
        .json({ success: true, message: "password did not match" });
    }

    return res.status(200).json({ success: true, message: "login successful" });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "failed to login user" });
  }
};
