import { makeAutoObservable } from "mobx";
import { addDays } from "date-fns";
import { createReport, getReports } from "../../shared/api";
import moment from "moment-timezone";

export interface IReportsList {
  id: string;
  user_id: string;
  date: string;
  name: string;
  link: string;
}

export interface ICardList {
  id: string;
  number: string;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
  key: string;
}

export class HomePageStore {
  isLoading: boolean = false;
  isLoadingCreateReport = false;
  reportsList: IReportsList[] = [];
  cardList: ICardList[] = [];
  selectedCardList: ICardList[] = [];
  modalState: boolean = false;
  snackbarState: boolean = false;
  timers: Record<string, string> = {}; // Хранилище таймеров

  selectedRange: DateRange = {
    startDate: new Date(),
    endDate: addDays(new Date(), 7),
    key: "selection",
  };

  constructor() {
    makeAutoObservable(this);

    this.getReportsList();
  }

  getReportsList = async () => {
    try {
      const reports = await getReports();

      this.reportsList = reports.data.report;

      this.reportsList.forEach((report) => {
        if (report.link.length === 0) {
          this.startTimer(report.id, report.date);
        }
      });
    } catch (error) {
      console.log(error);
    } finally {
      this.isLoading = false;
    }
  };

  setRange = (params: DateRange) => {
    this.selectedRange = params;
  };

  sendReport = async () => {
    this.isLoadingCreateReport = true;

    await createReport(
      this.transformDate(this.selectedRange.startDate),
      this.transformDate(this.selectedRange.endDate)
    );
    this.isLoadingCreateReport = false;

    this.handleClose();
    this.getReportsList();
  };

  startTimer = (id: string, isoDate: string) => {
    const receivedTime = moment.utc(isoDate).valueOf();
    const currentTime = moment().valueOf();

    const endTime = receivedTime + 300300; // Добавляем 5 минут

    if (currentTime >= endTime) {
      console.log(`Таймер ${id} уже истёк, запуск невозможен.`);
      return;
    }

    const remainingTime = endTime - currentTime;
    this.timers[id] = this.formatTime(remainingTime);

    const interval = setInterval(() => {
      const now = Date.now();
      const timeLeft = endTime - now;

      if (timeLeft <= 0) {
        clearInterval(interval);
        delete this.timers[id];
        this.getReportsList();
      } else {
        this.timers[id] = this.formatTime(timeLeft);
      }
    }, 1000);
  };

  formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `0${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  handleClose = () => {
    this.modalState = false;
  };

  handleOpen = () => {
    this.modalState = true;
  };

  private transformDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };
}
