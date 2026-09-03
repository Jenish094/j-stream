import { createTheme } from "../types";
import { darkTheme } from "../default";

export default createTheme({
  name: "dark-theme",
  extend: darkTheme.extend,
});
