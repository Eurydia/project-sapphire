import { theme } from "@/theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import type { FC } from "react";
import { ToastContainer } from "react-toastify";
import "./root.styles.css";

const RouteComponent: FC = () => {
  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Outlet />
      </ThemeProvider>
      <ToastContainer pauseOnFocusLoss={false} />
      <TanStackRouterDevtools />
    </>
  );
};

export const Route = createRootRoute({
  component: RouteComponent,
});
