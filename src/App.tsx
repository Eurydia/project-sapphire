import {
  createTheme,
  CssBaseline,
  ThemeProvider,
} from "@mui/material";
import {
  createHashRouter,
  RouterProvider,
} from "react-router";
import { HOME_CONTROLLER } from "./Home/home.controller";
import { REPOSITORY_CONTROLLER } from "./Repository/repository.controller";

const ROUTER = createHashRouter([
  HOME_CONTROLLER,
  REPOSITORY_CONTROLLER,
]);
const THEME = createTheme();
export const App = () => {
  return (
    <ThemeProvider theme={THEME}>
      <CssBaseline />
      <RouterProvider router={ROUTER} />
    </ThemeProvider>
  );
};
