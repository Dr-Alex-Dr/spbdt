import { observer } from "mobx-react";
import React from "react";
import { AuthPage } from "./Pages/AuthPage";

export const App: React.FC = observer(() => {
  return <AuthPage></AuthPage>;
});
