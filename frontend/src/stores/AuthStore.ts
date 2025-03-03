import { makeAutoObservable } from "mobx";
import { Login } from "../shared/api";

export class AuthStore {
  isAuthenticated = false;
  token: string | null = localStorage.getItem("token");

  constructor() {
    makeAutoObservable(this);
  }

  login = async (email: string, password: string) => {
    try {
      const res = await Login({ email, password });
      this.token = res.data.token || null;
      localStorage.setItem("token", this.token || "");
      this.isAuthenticated = true;
    } catch (error) {
      console.error(error);
    }
  };

  logout = () => {
    this.token = null;
    localStorage.removeItem("token");
    this.isAuthenticated = false;
  };

  checkAuth = () => {
    this.isAuthenticated = !!this.token;
  };
}
