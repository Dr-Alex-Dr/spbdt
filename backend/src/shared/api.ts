import axios from "axios";
import qs from "qs";
import dotenv from "dotenv";
import { timestamp } from "../controllers/timestamp";
const fs = require("fs");

dotenv.config();

const baseUrl = "https://api.opti-24.ru";

export const getSessionId = async () => {
  const headers = {
    api_key: process.env.OPTI_API,
    date_time: timestamp(),
    "Content-Type": "application/x-www-form-urlencoded",
  };

  const data = qs.stringify({
    login: process.env.LOGIN,
    password: process.env.PASSWORD,
  });

  try {
    const response = await axios.post(`${baseUrl}/vip/v1/authUser`, data, {
      headers,
    });

    return response.data.data.session_id;
  } catch (error) {
    console.error("Error:", error);
  }
};

export const getReports = async () => {
  const headers = {
    api_key: process.env.OPTI_API,
    session_id: process.env.SESSION_ID,
  };

  const data = qs.stringify({
    login: process.env.LOGIN,
    password: process.env.PASSWORD,
  });

  try {
    const response = await axios.get(`${baseUrl}/vip/v2/reports`, {
      headers,
    });

    return response.data;
  } catch (error) {
    console.error("Error:", error);
  }
};

export const createReportRequestApi = async (
  id: string,
  start_date: string,
  end_date: string,
  id_card: string[]
) => {
  const headers = {
    api_key: process.env.OPTI_API,
    date_time: timestamp(),
    session_id: process.env.SESSION_ID,
    "Content-Type": "application/json",
  };

  const data = JSON.stringify({
    id,
    format: "xlsx",
    params: {
      start_date,
      end_date,
      id_card,
      id_agreement: ["1-15TEUP5H"],
    },
  });

  try {
    const response = await axios.post(`${baseUrl}/vip/v2/reports`, data, {
      headers,
    });

    return response.data;
  } catch (error) {
    console.error("Error:", error);
  }
};

export const getReportFile = async (job_id: string) => {
  const headers = {
    api_key: process.env.OPTI_API,
    session_id: process.env.SESSION_ID,
    date_time: timestamp(),
  };

  try {
    const response = await axios.get(
      `${baseUrl}/vip/v2/reports/jobs/${job_id}`,
      {
        headers,
        responseType: "stream",
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error:", error);
  }
};
