import express from "express";
import cors from "cors"; // Middleware to enable CORS
import "dotenv/config";
import cookieParser from "cookie-parser"; // To parse cookies from requests
import connetDB from "./config/mongodb.js"; // Your MongoDB connection module
import authRouter from "./routes/authRoutes.js"; // Auth routes (login/logout/etc.)
import userRouter from "./routes/userRouted.js"; // User-related routes

const app = express();
const port = process.env.PORT || 4000;

// Connect to MongoDB
connetDB();

const allowedOrigins = [
  "http://localhost:5173", // for local development
  "https://mern-auth-frontend-jijf.onrender.com", // your deployed frontend on Render
];

// CORS configuration with dynamic origin and credentials support
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin, e.g., Postman or mobile apps (optional)
      if (!origin) return callback(null, true);

      // Check if request origin is in allowed list
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allows cookies and credentials to be sent cross-origin
  })
);

app.use(express.json()); // Parse JSON request bodies
app.use(cookieParser()); // Parse cookies

// Simple test endpoint
app.get("/", (req, res) => res.send("API Working"));

// Use your auth and user routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

// Start server
app.listen(port, () => console.log(`Server started on PORT : ${port}`));
