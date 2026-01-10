import express from "express";
import cors from "cors";
import path from "path";

const app = express();


app.use(express.json());


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
