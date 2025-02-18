import bcrypt from "bcryptjs";
import { query } from "./db";
import { User } from "./authController";

export const findUser = async (username: string) => {
  const user = await query('SELECT * FROM "Users" WHERE login = $1;', [
    username,
  ]);

  if (user.length === 0) {
    return null;
  }

  return user[0] as User;
};

export const createUser = async (username: string, password: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  await query('INSERT INTO "Users" (login, "password") VALUES ($1, $2)', [
    username,
    hashedPassword,
  ]);
};
