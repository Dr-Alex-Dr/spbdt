import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Modal,
} from "@mui/material";
import { observer } from "mobx-react";
import { HomePageStore } from "../../Pages/HomePage/HomePageStore";
import React from "react";
import styles from "./CreateReportModal.module.scss";
import { CalendarDateRange } from "../CalendarDataRange/CalendarDateRange";
import CloseIcon from "@mui/icons-material/Close";

export interface ICreateReportModalParams {
  store: HomePageStore;
}

// const names = [
//   "Оборот по картам по типам клиентов в разрезе цен на продукты, услуги за период",
//   "Итоговый протокол транзакций (ведомость)",
//   "Транзакционный отчет за период",
// ];

export const CreateReportModal: React.FC<ICreateReportModalParams> = observer(
  ({ store }) => {
    const { handleClose, modalState, sendReport, isLoadingCreateReport } =
      store;

    const renderLoading = () => {
      return (
        <div className={styles.loadingContainer}>
          <CircularProgress size="25px" />
        </div>
      );
    };

    return (
      <Modal open={modalState} onClose={handleClose}>
        <Box className={styles.modalContainer}>
          {isLoadingCreateReport ? (
            renderLoading()
          ) : (
            <div className={styles.wrapper}>
              <div className={styles.modalHeader}>
                <IconButton aria-label="close" onClick={handleClose}>
                  <CloseIcon />
                </IconButton>
              </div>

              {/* <FormControl fullWidth size="medium">
            <InputLabel>Тип отчёта *</InputLabel>
            <Select value={age} label="Type report" onChange={handleChange}>
              {names.map((name) => (
                <MenuItem value={name}>{name}</MenuItem>
              ))}
            </Select>
          </FormControl> */}

              <CalendarDateRange store={store} />
              <Button onClick={sendReport} variant="contained">
                Заказать отчет
              </Button>
            </div>
          )}
        </Box>
      </Modal>
    );
  }
);
