import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { createUser, findUser } from "./userModel";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

export interface User {
  login: string;
  password: string;
  id?: string;
}

export const register = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = await findUser(username);

  if (user) {
    return res.status(400).json({ message: "Пользователь уже существует" });
  }

  const newUser = await createUser(username, password);
  res
    .status(201)
    .json({ message: "Пользователь зарегистрирован", user: newUser });
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = await findUser(username);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Неверный токен" });
  }

  const token = jwt.sign({ id: user.id, username: user.login }, JWT_SECRET, {
    expiresIn: "1h",
  });
  res.json({ token });
};

export const protectedRoute = (req: Request, res: Response) => {
  res.json({ message: `Йоу, ${(req as any).user.username}!` });
};
