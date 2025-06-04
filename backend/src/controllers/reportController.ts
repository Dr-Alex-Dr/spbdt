import { createReportRequestApi, getReportFile } from "../shared/api";
import fs from "fs";
import path from "path";
import {
  insertReport,
  selectReportByUserId,
  updateReport,
} from "../models/reportModel/reportModel";
import DelayedQueue from "./delayedQueue";
import { AuthRequest } from "../middlewares/authMiddleware";
import { Response } from "express";
import { editXLSX } from "./editXLSX";
import { findUser } from "../models/userModel/userModel";
import moment from "moment-timezone";
import { selectAllCards } from "../models/cardModel/cardModel";

const queue = DelayedQueue.getInstance();

export const createReportRequest = async (req: AuthRequest, res: Response) => {
  const { username, id } = req.user;
  const { startDate, endDate } = req.body;
  const cards = await selectAllCards(id);
  const transformCards = cards.map((card) => card.card_number);
  console.log(transformCards);

  const report = await createReportRequestApi(
    "tsc_report_transaction_reriod",
    startDate,
    endDate,
    transformCards
  );

  console.log(new Date());

  if (report) {
    const reportId = await insertReport(
      "",
      id,
      moment().toISOString(),
      "Транзакционный отчет за период"
    );

    queue.add(downloadReportFile, report.data.job_id[0], username, reportId);

    res.json({ report });
  } else {
    res.status(500).json({ message: "Ошибка при создании отчета" });
  }
};

export const downloadReportFile = async (
  job_id: string,
  username: string,
  report_id: string
) => {
  const data = await getReportFile(job_id);
  const nameFile = `${new Date().getTime()}.xlsx`;

  const fileStream = fs.createWriteStream(
    path.join(process.cwd(), `./src/public/reports/${nameFile}`)
  );

  data.pipe(fileStream);

  fileStream.on("finish", async () => {
    await editXLSX(
      path.join(process.cwd(), `./src/public/reports/${nameFile}`)
    );

    const user = await findUser(username);

    if (!user || !user.id) {
      console.log("Пользователь не найден");
      return;
    }

    await updateReport(report_id, `http://localhost:3001/reports/${nameFile}`);

    console.log("Файл успешно сохранен!");
  });

  fileStream.on("error", (err) => {
    console.error("Ошибка при сохранении файла:", err);
  });
};

export const getReports = async (req: AuthRequest, res: Response) => {
  const user = await findUser((req as any).user.username);

  if (user?.id) {
    const report = await selectReportByUserId(user?.id);

    res.json({ report });
  }
};
