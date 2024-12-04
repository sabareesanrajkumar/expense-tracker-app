const express = require("express");
const router = express.Router();

const userController = require("../contollers/users");

router.post("/signup", userController.createUser);

module.exports = router;
