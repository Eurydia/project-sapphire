import { fetchTechnologyAll } from "@/api/technologies";
import { fetchTopicAll } from "@/api/topics";
import { CreateProjectForm } from "@/components/form/CreateProjectForm";
import { StyledLink } from "@/components/StyledLink";
import { KeyboardArrowLeftRounded } from "@mui/icons-material";
import { AppBar, Box, Paper, Toolbar, Typography } from "@mui/material";
import { createFileRoute, defer } from "@tanstack/react-router";
import { memo } from "react";
import { toast } from "react-toastify";

const RouteComponent = memo(() => {
  const navigate = Route.useNavigate();
  const { techOptionsPromise, topicOptionsPromise } = Route.useLoaderData();
  return (
    <>
      <AppBar position="sticky" color="default" variant="outlined">
        <Toolbar variant="dense">
          <StyledLink to="/projects" component="div">
            <Typography
              sx={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 0.5,
                alignItems: "center",
              }}
            >
              <KeyboardArrowLeftRounded />
              {`Projects`}
            </Typography>
          </StyledLink>
        </Toolbar>
      </AppBar>
      <Box sx={{ maxWidth: "md", margin: "auto", paddingY: 2 }}>
        <Paper variant="outlined" sx={{ padding: 2 }}>
          <CreateProjectForm
            onSubmitSuccess={() => {
              toast.success("Project added");
              navigate({ to: "/projects" });
            }}
            onError={() => {
              toast.error("Failed to add project");
            }}
            topicOptionsPromise={topicOptionsPromise}
            techOptionsPromise={techOptionsPromise}
          />
        </Paper>
      </Box>
    </>
  );
});

export const Route = createFileRoute("/projects/create")({
  component: RouteComponent,
  loader: () => {
    const topicOptionsPromise = defer(
      fetchTopicAll().then((res) => res.map(({ name }) => name)),
    );
    const techOptionsPromise = defer(
      fetchTechnologyAll().then((res) => res.map(({ name }) => name)),
    );
    return { topicOptionsPromise, techOptionsPromise };
  },
});
