import { Box } from "@mui/material";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { type FC } from "react";

const RouteComponent: FC = () => {
  return (
    <Box sx={{ padding: 4, maxHeight: "100vh" }}>
      <Outlet />
    </Box>
  );
};

export const Route = createFileRoute("/projects/$projectId")({
  component: RouteComponent,
  // loader: (ctx) => {
  //   // const segments = ctx.location.pathname.split('/').filter(Boolean).slice(2)
  //   // throw notFound();
  // },
});
