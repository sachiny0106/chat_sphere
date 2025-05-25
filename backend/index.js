// backend/index.js
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

const dotenvResult = dotenv.config();

if (dotenvResult.error) {
  console.error('[Backend FATAL ERROR] Error loading .env file:', dotenvResult.error);
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 8080;

// Define the backend's own origin. This is important if the backend serves the frontend.
const backendAppOrigin = `http://localhost:${PORT}`; // e.g., 'http://localhost:8080'

const _dirname = path.resolve();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// --- CORS Configuration ---
// Start with a base set of allowed origins.
const allowedOrigins = [
    'http://localhost:3000', // Common for frontend dev servers (e.g., React, Vue)
    backendAppOrigin         // Crucial: Allow the backend's own origin, as it serves the built frontend
];

// Add FRONTEND_URL from .env if it's defined and not already in the list.
// This is useful for deployed environments or if FRONTEND_URL is different.
if (process.env.FRONTEND_URL && !allowedOrigins.includes(process.env.FRONTEND_URL)) {
    allowedOrigins.push(process.env.FRONTEND_URL);
} else if (process.env.NODE_ENV === 'production' && !process.env.FRONTEND_URL) {
    // Warn if in production and FRONTEND_URL isn't explicitly set,
    // though backendAppOrigin might cover the deployed case if it's the same.
    console.warn("WARNING: FRONTEND_URL environment variable is not set in production. Ensure CORS is configured correctly for your deployed frontend URL.");
}

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.error(`[CORS Error] Origin '${origin}' not allowed by CORS policy. Allowed origins: ${allowedOrigins.join(', ')}`);
            callback(new Error(`Origin '${origin}' not allowed by CORS`), false);
        }
    },
    credentials: true, // Allows cookies to be sent and received
};
app.use(cors(corsOptions));

// --- API Routes ---
app.use("/api/v1/user", userRoute);
app.use("/api/v1/message", messageRoute);

app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "Backend API is running", timestamp: new Date().toISOString() });
});

// --- Static File Serving (for the built frontend) ---
// This assumes your frontend is built into 'frontend/build' relative to the project root.
const frontendBuildPath = path.join(_dirname, "frontend", "build");
app.use(express.static(frontendBuildPath));

// --- SPA Fallback (serves index.html for any routes not handled above) ---
// This must come AFTER API routes and static file serving.
app.get("*", (req, res) => {
    // Check if the request looks like an API call to avoid serving index.html for missing API routes
    if (req.originalUrl.startsWith('/api/')) {
        return res.status(404).json({ message: 'API endpoint not found' });
    }
    res.sendFile(path.join(frontendBuildPath, "index.html"));
});


// --- Server Initialization ---
const httpServer = http.createServer(app);
initializeSocketIO(httpServer); // Initialize Socket.IO with the HTTP server

const startServer = async () => {
    try {
        await connectDB(); // Connect to the database
        httpServer.listen(PORT, () => {
            console.log(`[Backend] Server listening on ${backendAppOrigin}`);
            if (process.env.NODE_ENV !== 'production') {
                console.log(`[Backend Dev] Frontend expected at http://localhost:3000 (dev server) or ${backendAppOrigin} (if served by backend)`);
            }
            if (process.env.FRONTEND_URL) {
                console.log(`[Backend] Configured to additionally allow CORS for: ${process.env.FRONTEND_URL}`);
            }
            console.log(`[Backend] Full list of allowed CORS origins: ${allowedOrigins.join(', ')}`);
        });
    } catch (error) {
        console.error("[Backend] CRITICAL ERROR during server startup:", error);
        process.exit(1);
    }
};

startServer();

export default app; // Export app for testing or other potential uses