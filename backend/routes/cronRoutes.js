const express = require("express");
const verifyCronSecret = require("../middleware/cronAuthMiddleware");
const { runMorningSummary, runDeadlineAlerts } = require("../controllers/cronController");

const router = express.Router();

router.post("/morning-summary", verifyCronSecret, runMorningSummary);
router.post("/deadline-alerts", verifyCronSecret, runDeadlineAlerts);

module.exports = router;
