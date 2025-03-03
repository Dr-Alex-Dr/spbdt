let moment = require("moment");

export const timestamp = () => {
  return moment().format("YYYY-MM-DD HH:mm:ss");
};
