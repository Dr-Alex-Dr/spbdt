import { observer } from "mobx-react";
import React from "react";
import { AuthPage } from "./Pages/AuthPage";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import { HomePage } from "./Pages/HomePage/HomePage";

export const App: React.FC = observer(() => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<AuthPage />} />
        <Route element={<PrivateRoute />}>
          <Route path="/home" element={<HomePage />} />
        </Route>
        <Route path="*" element={<AuthPage />} />
      </Routes>
    </Router>
  );
});
