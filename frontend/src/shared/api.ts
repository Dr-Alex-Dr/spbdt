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
