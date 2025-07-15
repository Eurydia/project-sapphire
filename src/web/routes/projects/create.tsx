import { Paper } from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";
import type { FC } from "react";
import { memo } from "react";
import { toast } from "react-toastify";
import { postProject } from "~/api/db/projects";
import { fetchTechnologyAll } from "~/api/db/technologies";
import { fetchTopicAll } from "~/api/db/topics";
import { ProjectForm } from "~/components/form/ProjectForm";

const RouteComponent: FC = memo(() => {
  const { options } = Route.useLoaderData();
  const navigate = Route.useNavigate();
  return (
    <Paper variant="outlined">
      <ProjectForm
        action={(dto) =>
          postProject(dto)
            .then(() => navigate({ to: "/projects" }))
            .then(() => toast.success("Project added"))
            .catch(() => toast.error("Failed to add project"))
        }
        options={options}
      />
    </Paper>
  );
});

export const Route = createFileRoute("/projects/create")({
  component: RouteComponent,
  loader: async () => {
    return {
      options: {
        topics: (await fetchTopicAll()).map(({ name }) => name),
        technologies: (await fetchTechnologyAll()).map(({ name }) => name),
      },
    };
  },
});
