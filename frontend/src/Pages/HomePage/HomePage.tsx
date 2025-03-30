import { observer } from "mobx-react";
import { Header } from "../../components/Header/Header";
import { Title } from "../../components/Title/Title";
import styles from "./HomePage.module.scss";
import { ListReports } from "../../components/ListReports/ListReports";
import { HomePageStore } from "./HomePageStore";
import { useMemo } from "react";
import { Button, CircularProgress } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { CreateReportModal } from "../../components/CreateReportModal/CreateReportModal";

export const HomePage: React.FC = observer(() => {
  const store = useMemo(() => new HomePageStore(), []);
  const { isLoading, handleOpen } = store;

  const renderLoading = () => {
    return (
      <div className={styles.loadingContainer}>
        <CircularProgress size="17px" />
        <span className={styles.loadingText}>Загрузка отчетов</span>
      </div>
    );
  };

  return (
    <div>
      <Header />
      <div className={styles.container}>
        <div className={styles.titleContainer}>
          <Title title="Список отчетов" />
          <Button
            onClick={handleOpen}
            startIcon={<AddRoundedIcon fontSize="medium" />}
          >
            Заказать отчет
          </Button>
        </div>

        {isLoading ? renderLoading() : <ListReports store={store} />}
      </div>
      <CreateReportModal store={store} />
    </div>
  );
});
