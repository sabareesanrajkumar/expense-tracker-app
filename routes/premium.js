const express = require("express");
const router = express.Router();

const premiumController = require("../controllers/premium");
const userAuthentication = require("../middleware/auth");

router.get("/leaderboard", premiumController.getLeaderBoard);

module.exports = router;
