import { Box } from "@mui/material";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { type FC } from "react";

const RouteComponent: FC = () => {
  return (
    <Box margin={4}>
      <Outlet />
    </Box>
  );
};

export const Route = createFileRoute("/projects/$projectId")({
  component: RouteComponent,
  loader: (ctx) => {
    // const segments = ctx.location.pathname.split('/').filter(Boolean).slice(2)
    // throw notFound();
  },
});
