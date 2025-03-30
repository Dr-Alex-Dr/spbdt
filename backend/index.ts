import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { register, login } from "./src/controllers/authController";
import { authenticateToken } from "./src/middlewares/authMiddleware";
import { authOptiController } from "./src/controllers/authOptiController";
import {
  createReportRequest,
  getReports,
} from "./src/controllers/reportController";
import {
  addCards,
  deleteCards,
  getAllCards,
} from "./src/controllers/cardController";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/register", register);
app.post("/login", login);

app.post("/report", authenticateToken, createReportRequest);
app.get("/reports", authenticateToken, getReports);

app.post("/cards", addCards);
app.get("/cards", getAllCards);
app.delete("/cards", deleteCards);

// authOptiController();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
