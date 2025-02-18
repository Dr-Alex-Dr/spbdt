import { makeAutoObservable } from "mobx";

export class AuthStore {
  isAuthenticated = false;
  token: string | null = localStorage.getItem("token");

  constructor() {
    makeAutoObservable(this);
  }

  login = async (email: string, password: string) => {
    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error("Login failed");

      const data = await response.json();
      this.token = data.token;
      localStorage.setItem("token", data.token);
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
