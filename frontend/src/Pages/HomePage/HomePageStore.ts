import { makeAutoObservable } from "mobx";
import { mockReports } from "./mockReports";

export interface IReportsList {
  id: string;
  date: string;
  name: string;
  link: string;
}

export interface ICardList {
  id: string;
  number: string;
}

export class HomePageStore {
  isLoading: boolean = false;
  reportsList: IReportsList[] = [];
  cardList: ICardList[] = [];
  selectedCardList: ICardList[] = [];
  modalState: boolean = false;

  constructor() {
    makeAutoObservable(this);

    this.getReports();
  }

  getReports = async () => {
    try {
      this.isLoading = true;
      await new Promise((resolve) => setTimeout(resolve, 3000));
      this.reportsList = [...mockReports];
    } catch (error) {
      console.log(error);
    } finally {
      this.isLoading = false;
    }
  };

  getCards = async () => {
    try {
      this.isLoading = true;
      await new Promise((resolve) => setTimeout(resolve, 3000));
      this.cardList = [...mockReports];
    } catch (error) {
      console.log(error);
    } finally {
      this.isLoading = false;
    }
  };

  handleClose = () => {
    this.modalState = false;
  };

  handleOpen = () => {
    this.modalState = true;
  };
}
