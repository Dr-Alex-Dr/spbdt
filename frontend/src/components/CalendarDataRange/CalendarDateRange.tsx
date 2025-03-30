import { ru } from "date-fns/locale";
import { observer } from "mobx-react-lite";
import { DateRangePicker } from "react-date-range";
import { defaultStaticRanges } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "./CalendarDateRange.scss";
import { DateRange, HomePageStore } from "../../Pages/HomePage/HomePageStore";

const customStaticRanges = defaultStaticRanges.map((range) => {
  switch (range.label) {
    case "Today":
      return { ...range, label: "Сегодня" };
    case "Yesterday":
      return { ...range, label: "Вчера" };
    case "This Week":
      return { ...range, label: "Эта неделя" };
    case "Last Week":
      return { ...range, label: "Прошлая неделя" };
    case "This Month":
      return { ...range, label: "Этот месяц" };
    case "Last Month":
      return { ...range, label: "Прошлый месяц" };
    default:
      return range;
  }
});

export interface ICalendarDateRangeParams {
  store: HomePageStore;
}

export const CalendarDateRange: React.FC<ICalendarDateRangeParams> = observer(
  ({ store }) => {
    const { setRange, selectedRange } = store;

    return (
      <DateRangePicker
        onChange={(item) => setRange(item.selection as DateRange)}
        staticRanges={customStaticRanges}
        moveRangeOnFirstSelection={false}
        months={2}
        ranges={[selectedRange]}
        direction="horizontal"
        locale={ru}
      />
    );
  }
);
