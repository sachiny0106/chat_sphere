// backend/middleware/isAuthenticated.js
import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "User not authenticated. Please login." });
    }

    if (!process.env.JWT_SECRET_KEY) {
        console.error("[isAuthenticated] FATAL: JWT_SECRET_KEY is not defined on the server!");
        return res.status(500).json({ message: "Server configuration error." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); // Use synchronous verify or handle promise if async

    if (!decoded || !decoded.userId) {
        return res.status(401).json({ message: "Invalid token." });
    }

    req.id = decoded.userId; // Attach userId to the request object
    next();

  } catch (error) {
    console.error("[isAuthenticated] Authentication error:", error.name, error.message);
    if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: "Token expired. Please login again.", errorType: "TokenExpiredError" });
    }
    if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: "Invalid token format or signature.", errorType: "JsonWebTokenError" });
    }
    // For other errors, it might be a server issue
    return res.status(500).json({ message: "Error during token verification." });
  }
};

export default isAuthenticated;