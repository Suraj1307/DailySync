const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const { clerkMiddleware } = require("@clerk/express");
const env = require("./config/env");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const telegramRoutes = require("./routes/telegramRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const cronRoutes = require("./routes/cronRoutes");
const startCronJobs = require("./cron/scheduler");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));
app.use(
  clerkMiddleware({
    publishableKey: env.clerkPublishableKey,
    secretKey: env.clerkSecretKey
  })
);

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "dailysync-backend",
    timestamp: new Date().toISOString()
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/task", taskRoutes);
app.use("/api/telegram", telegramRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/cron", cronRoutes);

app.use(notFound);
app.use(errorHandler);

const boot = async () => {
  await connectDB();
  app.listen(env.port, () => {
    console.log(`Server running on port ${env.port}`);
  });
  startCronJobs();
};

boot().catch((error) => {
  console.error("Failed to boot server", error);
  process.exit(1);
});
