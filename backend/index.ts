import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import path from "path";
import {authRouter} from './routes/authRouter'
const app = express();


app.use(express.json());
const allowedOrigins = [
  'http://localhost:8080'
]
app.use(
  cors({
    origin: function (origin, callback) {
      const allowAll = !origin || allowedOrigins.includes(origin);
      if (allowAll) {
        callback(null, true);
      } else {
        console.error("Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  })
)

app.use('/api',authRouter)

app.get("/check", (req, res) => {
  return res.json({ 
    message: "Running",
    platform: process.env.VERCEL ? "Vercel (Serverless)" : "Railway (Persistent)"
  });
});


app.get("/checkHost", (req, res) => {
  return res.json({
    message:
      process.env.NODE_ENV === "development"
        ? "Development server is running"
        : "Production server is running",
  });
});

if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 4000; 
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
