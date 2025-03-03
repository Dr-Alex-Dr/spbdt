import { observer } from "mobx-react";
import styles from "./Header.module.scss";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const Header: React.FC = observer(() => {
  const navigate = useNavigate();

  const onExit = () => {
    localStorage.setItem("token", "");
    navigate("/login", { replace: true });
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.logo}>spbdt</h2>

      <Button className={styles.exit} onClick={onExit}>
        Выход
      </Button>
    </div>
  );
});
