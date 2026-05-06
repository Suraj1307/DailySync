const express = require("express");
const { requireClerkAuth, attachCurrentUser } = require("../middleware/authMiddleware");
const { getDashboard } = require("../controllers/dashboardController");

const router = express.Router();

router.get("/", requireClerkAuth, attachCurrentUser, getDashboard);

module.exports = router;
