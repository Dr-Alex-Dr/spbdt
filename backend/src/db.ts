import { Client } from "pg";
import dotenv from "dotenv";

dotenv.config();

const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

try {
  client.connect();
  console.log("Connected to PostgreSQL");
} catch (err) {
  console.error("Connection error", (err as any).stack);
}

export const query = async (text: string, params?: any[]) => {
  try {
    const res = await client.query(text, params);
    return res.rows;
  } catch (err) {
    console.error("Error executing query", err);
    throw err;
  }
};
