import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { register, login, protectedRoute } from "./src/authController";
import { authenticateToken } from "./src/authMiddleware";
import { authOpti } from "./src/controllers/authOpti";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/register", register);
app.post("/login", login);
app.get("/protected", authenticateToken, protectedRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
