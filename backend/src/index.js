import express from "express";
import "dotenv/config";
import authRoutes from "./routes/authRoutes.js";
import { connectDB } from "./lib/db.js";


const app = express();

const PORT = process.env.PORT || 3000;

app.use("/api/auth", authRoutes);

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => {
    console.log("Unable to connect to DB: ", error);
    process.exit(1);
  });
