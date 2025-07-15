import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({ to: "/projects" });
  },
  notFoundComponent: () => {
    throw redirect({ to: "/projects" });
  },
});
