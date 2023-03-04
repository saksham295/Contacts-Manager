import express from "express";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import userRoutes from "./routes/user.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/user", userRoutes);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "./client/build")));
app.get("*", function (_, res) {
  res.sendFile(
    path.join(__dirname, "./client/build/index.html"),
    function (err) {
      res.status(500).send(err);
    }
  );
});

const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT;

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});
