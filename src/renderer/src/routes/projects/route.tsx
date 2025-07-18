import { Box } from "@mui/material";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { memo, type FC } from "react";

const RouteComponent: FC = memo(() => {
  return (
    <Box padding={2} maxWidth="lg" marginX="auto">
      <Outlet />
    </Box>
  );
});

export const Route = createFileRoute("/projects")({
  component: RouteComponent,
});
