import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import routes from "./routes";       
import { connectDB } from "./src/db";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api", routes);

connectDB()
  .then(() => {
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB:", err);
    process.exit(1);
  });
