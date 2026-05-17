import express from "express";
import cors from "cors"; 
import "dotenv/config";
import cookieParser from "cookie-parser"; 
// Corrected misspelled name from 'connetDB' to 'connectDB'
import connectDB from "./config/mongodb.js"; 
import authRouter from "./routes/authRoutes.js"; 
import userRouter from "./routes/userRouted.js"; // Assuming 'userRouted.js' is the correct filename

const app = express();
const port = process.env.PORT || 4000;

// Corrected function call to use 'connectDB'
connectDB();

const allowedOrigins = [
  "http://localhost:5173", 
  "https://mern-auth-frontend-jijf.onrender.com",
];

// CORS configuration (no changes)
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, 
  })
);

app.use(express.json()); 
app.use(cookieParser()); 

// Simple test endpoint (no changes)
app.get("/", (req, res) => res.send("API Working"));

// Use your auth and user routes (no changes)
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

// Start server (no changes)
app.listen(port, () => console.log(`Server started on PORT : ${port}`));