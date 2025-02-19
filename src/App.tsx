import {
  createTheme,
  CssBaseline,
  ThemeProvider,
} from "@mui/material";
import {
  createHashRouter,
  RouterProvider,
} from "react-router";
import { DIRECTORY_CONTROLLER } from "~routes/directory.route";
import { FILE_CONTROLLER } from "~routes/file.route";
import { HOME_CONTROLLER } from "~routes/home.route";

const ROUTER = createHashRouter([
  HOME_CONTROLLER,
  DIRECTORY_CONTROLLER,
  FILE_CONTROLLER,
]);
const THEME = createTheme({
  palette: { mode: "light" },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
        disableRipple: true,
        disableFocusRipple: true,
        disableTouchRipple: true,
      },
    },
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
