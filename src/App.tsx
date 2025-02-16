import {
  createTheme,
  CssBaseline,
  ThemeProvider,
} from "@mui/material";
import {
  createHashRouter,
  RouterProvider,
} from "react-router";
import { DIRECTORY_CONTROLLER } from "./routes/Directory/directory.controller";
import { FILE_CONTROLLER } from "./routes/File/file.controller";
import { HOME_CONTROLLER } from "./routes/Home/home.controller";

const ROUTER = createHashRouter([
  HOME_CONTROLLER,
  DIRECTORY_CONTROLLER,
  FILE_CONTROLLER,
]);
const THEME = createTheme({
  palette: { mode: "light" },
  typography: {
    fontFamily: "roboto",
  },
});

export const App = () => {
  return (
    <ThemeProvider theme={THEME}>
      <CssBaseline />
      <RouterProvider router={ROUTER} />
    </ThemeProvider>
  );
};
