import { observer } from "mobx-react";
import styles from "./Title.module.scss";

export interface ITitleParams {
  title: string;
}

export const Title: React.FC<ITitleParams> = observer(({ title }) => {
  return <h2 className={styles.Title}>{title}</h2>;
});
