import express from "express";
import cors from "cors";
import fs from "fs";
import { fileURLToPath } from "url";
import { config } from "./config/env.js";
import chatRoutes from "./routes/chatRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

const pkg = JSON.parse(fs.readFileSync(fileURLToPath(new URL('./package.json', import.meta.url))));

const app = express();
const PORT = config.PORT;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "AI Hackathon Starter Backend is Running 🚀"
    });
});

app.get("/health", (req, res) => {
    res.json({
        status: "ok",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        version: pkg.version || "1.0.0"
    });
});

app.use("/api/chat", chatRoutes);

// Global Error Handler Middleware
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT} in ${config.NODE_ENV} mode`);
});