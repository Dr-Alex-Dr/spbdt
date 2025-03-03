import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { observer } from "mobx-react";
import { HomePageStore } from "../../Pages/HomePage/HomePageStore";
import React from "react";
import styles from "./CreateReportModal.module.scss";
import { CalendarDateRange } from "../CalendarDataRange/CalendarDateRange";

export interface ICreateReportModalParams {
  store: HomePageStore;
}

const names = [
  "Оборот по картам по типам клиентов в разрезе цен на продукты, услуги за период",
  "Итоговый протокол транзакций (ведомость)",
  "Транзакционный отчет за период",
];

export const CreateReportModal: React.FC<ICreateReportModalParams> = observer(
  ({ store }) => {
    const { handleClose, modalState } = store;
    const [age, setAge] = React.useState("");

    const handleChange = (event: SelectChangeEvent) => {
      setAge(event?.target?.value as string);
    };

    return (
      <Modal open={modalState} onClose={handleClose}>
        <Box className={styles.modalContainer}>
          <FormControl fullWidth size="medium">
            <InputLabel>Тип отчёта *</InputLabel>
            <Select value={age} label="Type report" onChange={handleChange}>
              {names.map((name) => (
                <MenuItem value={name}>{name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <CalendarDateRange />
          <Button variant="contained">Заказать отчет</Button>
        </Box>
      </Modal>
    );
  }
);
