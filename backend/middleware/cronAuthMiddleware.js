const env = require("../config/env");

const verifyCronSecret = (req, res, next) => {
  const secret = req.headers["x-cron-secret"] || req.query.secret;

  if (!env.cronSecret || secret !== env.cronSecret) {
    return res.status(401).json({ message: "Invalid cron secret" });
  }

  next();
};

module.exports = verifyCronSecret;

