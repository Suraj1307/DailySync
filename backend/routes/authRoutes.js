const express = require("express");
const {
  syncCurrentUser,
  getCurrentUser,
  updatePreferences,
  logout
} = require("../controllers/authController");
const { requireClerkAuth, attachCurrentUser } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/sync", requireClerkAuth, syncCurrentUser);
router.get("/me", requireClerkAuth, attachCurrentUser, getCurrentUser);
router.patch("/preferences", requireClerkAuth, attachCurrentUser, updatePreferences);
router.post("/logout", requireClerkAuth, attachCurrentUser, logout);

module.exports = router;
