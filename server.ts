import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import routes from "./routes";
import { connectDB } from "./src/db";

dotenv.config();
  const port = process.env.PORT || 5000;
const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://cognitotrack.vercel.app"
    ],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  console.log("Incoming request to / route");
  res.status(200).json({
    success: true,
    message: "CognitoTrack API is working 🚀",
    port:port
  });
});

app.use("/api", routes);

connectDB();

if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => console.log(`Server running locally on port ${port}`));
}

export default app;
