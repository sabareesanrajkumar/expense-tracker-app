const Users = require("../models/users");

exports.createUser = async (req, res, next) => {
  try {
    const newUser = await Users.create(req.body);
    return res.status(200).json({ success: true, message: "user created" });
  } catch (err) {
    console.log(err);
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
