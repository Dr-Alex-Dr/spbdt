import axios from "axios";
import { url } from "./consts";

export interface User {
  email: string;
  password: string;
}

export const Login = async (user: User) => {
  return axios.post(
    `${url}/login`,
    {
      username: user.email,
      password: user.password,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export const createReport = async (startDate: string, endDate: string) => {
  return axios.post(
    `${url}/report`,
    {
      startDate,
      endDate,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
};

export const getReports = async () => {
  return axios.get(`${url}/reports`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};
