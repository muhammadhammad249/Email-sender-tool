import express from "express";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Email Sender Backend is running",
  });
});

import authRoutes from "./routes/auth.routes";
import campaignRoutes from "./routes/campaigns.routes";
import emailAccountRoutes from "./routes/email-accounts.routes";
import leadRoutes from "./routes/leads.routes";

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/email-accounts", emailAccountRoutes);
app.use("/api/leads", leadRoutes);

export default app;