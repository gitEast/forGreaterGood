import { CHANGE_NAME } from "./constants";

const changeNameAction = (name) => ({
  type: CHANGE_NAME,
  name
});

module.exports = {
  changeNameAction
};
