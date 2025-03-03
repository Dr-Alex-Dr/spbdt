import { addDays } from "date-fns";
import { ru } from "date-fns/locale";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { DateRangePicker } from "react-date-range";
import { defaultStaticRanges } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "./CalendarDateRange.scss";

interface DateRange {
  startDate: Date;
  endDate: Date;
  key: string;
}

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

export const CalendarDateRange = observer(() => {
  const [state, setState] = useState<DateRange[]>([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: "selection",
    },
  ]);

  return (
    <DateRangePicker
      onChange={(item) => setState([item.selection as DateRange])}
      staticRanges={customStaticRanges}
      moveRangeOnFirstSelection={false}
      months={2}
      ranges={state}
      direction="horizontal"
      locale={ru}
    />
  );
});
