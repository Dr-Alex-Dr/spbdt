import { query } from "../../shared/db";
import { v4 as uuidv4 } from "uuid";
import moment from "moment-timezone";

export const insertReport = async (
  link: string,
  user_id: string,
  date: string,
  name: string
) => {
  const uuid = uuidv4();

  await query(
    'INSERT INTO "Reports" (id, link, user_id, date, name) VALUES ($1, $2, $3, $4, $5)',
    [uuid, link, user_id, date, name]
  );

  return uuid;
};

export const updateReport = async (id: string, link: string) => {
  await query('UPDATE "Reports" SET link = $1 WHERE id = $2', [link, id]);
};

export const selectReportByUserId = async (user_id: string) => {
  const rows = await query('SELECT * FROM "Reports" WHERE user_id = $1', [
    user_id,
  ]);

  rows.forEach((row) => {
    row.date = moment(row.date).format("YYYY-MM-DD HH:mm:ss.SSS");
  });

  return rows;
};
