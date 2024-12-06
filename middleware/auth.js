const jwt = require("jsonwebtoken");
const Users = require("../models/users");

const authenticate = (req, res, next) => {
  try {
    const token = req.header("Authorization");
    const user = jwt.verify(token, "123456789");
    Users.findByPk(user.userId)
      .then((user) => {
        req.user = user;
        next();
      })
      .catch((err) => {
        throw new Error(err);
      });
  } catch (err) {
    console.log(err);
    return res
      .status(401)
      .json({ success: false, message: "authentication error" });
  }
};

module.exports = {
  authenticate,
};