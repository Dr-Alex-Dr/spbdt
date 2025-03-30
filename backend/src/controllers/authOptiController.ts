import { getSessionId } from "../shared/api";
import fs from "fs";
import path from "path";

export const authOptiController = async () => {
  const session_id = await getSessionId();

  const envPath = path.resolve(".env");

  try {
    let envData = fs.readFileSync(envPath, "utf8");

    if (envData.includes("SESSION_ID=")) {
      envData = envData.replace(/^SESSION_ID=.*/m, `SESSION_ID=${session_id}`);
    } else {
      envData += `\nSESSION_ID=${session_id}`;
    }

    fs.writeFileSync(envPath, envData, "utf8");

    console.log("SESSION_ID успешно обновлён!");
  } catch (error) {
    console.error("Ошибка при обновлении .env:", error);
  }
};
