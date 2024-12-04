const express = require("express");
const router = express.Router();

const userController = require("../contollers/users");

router.post("/signup", userController.createUser);
router.post("/login", userController.logIn);

module.exports = router;
