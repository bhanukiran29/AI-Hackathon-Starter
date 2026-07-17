import express from "express";
import cors from "cors";
import chatRoutes from "./routes/chatRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "AI Hackathon Starter Backend is Running 🚀"
    });
});

app.use("/api/chat", chatRoutes);

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});