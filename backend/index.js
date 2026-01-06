import dotenv from "dotenv";
import express from "express";
import http from "http";
import connectDB from "./config/database.js";
import userRoute from "./routes/userRoute.js";
import messageRoute from "./routes/messageRoute.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { initializeSocketIO } from "./socket/socket.js";
import path from "path";

// Load .env only in non-production environments
if (process.env.NODE_ENV !== "production") {
  const dotenvResult = dotenv.config();
  if (dotenvResult.error) {
    console.error("[Backend FATAL ERROR] Error loading .env file:", dotenvResult.error);
    process.exit(1);
  }
}

const app = express();
const PORT = process.env.PORT || 8080;

// Define backend origin for CORS
const backendAppOrigin = `http://localhost:${PORT}`;

const _dirname = path.resolve();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// --- CORS Configuration ---
const allowedOrigins = [
  "https://chat-sphere-znbh.onrender.com",
  "http://localhost:3000",
  backendAppOrigin
];

if (process.env.FRONTEND_URL && !allowedOrigins.includes(process.env.FRONTEND_URL)) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`[CORS Error] Origin '${origin}' not allowed. Allowed: ${allowedOrigins.join(', ')}`);
      callback(new Error(`Origin '${origin}' not allowed by CORS`), false);
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));

// --- API Routes ---
app.use("/api/v1/user", userRoute);
app.use("/api/v1/message", messageRoute);

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "Backend API is running", timestamp: new Date().toISOString() });
});

// --- Serve frontend (build) ---
const frontendBuildPath = path.join(_dirname, "frontend", "build");
app.use(express.static(frontendBuildPath));

// --- SPA fallback ---
app.get("*", (req, res) => {
  if (req.originalUrl.startsWith('/api/')) {
    return res.status(404).json({ message: 'API endpoint not found' });
  }
  res.sendFile(path.join(frontendBuildPath, "index.html"));
});

// --- Server Initialization ---
const httpServer = http.createServer(app);
initializeSocketIO(httpServer);

const startServer = async () => {
  try {
    await connectDB();
    httpServer.listen(PORT, () => {
      console.log(`[Backend] Server listening on ${backendAppOrigin}`);
      if (process.env.NODE_ENV !== "production") {
        console.log(`[Backend Dev] Frontend expected at https://chat-sphere-znbh.onrender.com or ${backendAppOrigin}`);
      }
      if (process.env.FRONTEND_URL) {
        console.log(`[Backend] CORS allowed: ${process.env.FRONTEND_URL}`);
      }
      console.log(`[Backend] Full allowed CORS origins: ${allowedOrigins.join(", ")}`);
    });
  } catch (error) {
    console.error("[Backend] CRITICAL ERROR during startup:", error);
    process.exit(1);
  }
};

startServer();

export default app;
