import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { observer } from "mobx-react-lite";
import { Link, styled } from "@mui/material";
import { HomePageStore } from "../../Pages/HomePage/HomePageStore";
import React from "react";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#0078D2",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const transformDate = (dateString: string) => {
  const date = new Date(dateString);

  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");

  return `${day}.${month}.${year}`;
};

export interface IListReportsParams {
  store: HomePageStore;
}

export const ListReports: React.FC<IListReportsParams> = observer(
  ({ store }) => {
    const { reportsList, timers } = store;

    return (
      <TableContainer component={Paper} elevation={0}>
        <Table sx={{ minWidth: 650 }} aria-label="ListReports">
          <TableHead>
            <StyledTableRow>
              <StyledTableCell>Дата заказа отчета</StyledTableCell>
              <StyledTableCell>Название отчета</StyledTableCell>
              <StyledTableCell>Статус отчета</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {reportsList.map((item, index) => (
              <StyledTableRow
                key={index}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <StyledTableCell>{transformDate(item.date)}</StyledTableCell>
                <StyledTableCell>{item.name}</StyledTableCell>
                <StyledTableCell>
                  {timers[item.id] ? (
                    timers[item.id]
                  ) : (
                    <Link href={item.link}>Скачать</Link>
                  )}
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
);
