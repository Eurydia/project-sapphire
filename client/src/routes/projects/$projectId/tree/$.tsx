import { ProjectTreeService } from "@/services/project-tree.service";
import { ProjectService } from "@/services/projects.services";
import {
  AppBar,
  Breadcrumbs,
  Card,
  CardContent,
  Paper,
  Toolbar,
} from "@mui/material";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { type FC } from "react";

const RouteComponent: FC = () => {
  const { project, tree } = Route.useLoaderData();
  return (
    <>
      <AppBar
        variant="outlined"
        color="default"
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Toolbar disableGutters variant="dense">
          <Breadcrumbs>
            {/* {segments.map((segment, idx) => {
              const to = `/${segment.href}`;
              const isLast = idx === segments.length - 1;
              return isLast ? (
                <Typography key={to} color="text.primary">
                  {segment.label}
                </Typography>
              ) : (
                <StyledLink key={to} to={to}>
                  {segment.label}
                </StyledLink>
              );
            })} */}
          </Breadcrumbs>
        </Toolbar>
      </AppBar>
      <Paper variant="outlined"></Paper>
      <Card variant="outlined">
        <CardContent>
          {/* {data.readme !== undefined && (
            <Markdown content={data.readme.content} />
          )}
          {data.readme === undefined && <Typography>Read me unset</Typography>} */}
        </CardContent>
      </Card>
    </>
  );
};

export const Route = createFileRoute("/projects/$projectId/tree/$")({
  component: RouteComponent,
  loader: async (ctx) => {
    const project = await ProjectService.find(ctx.params.projectId);
    if (project === null) {
      throw notFound();
    }

    const tree = await ProjectTreeService.getTree(
      project.id,
      ctx.params._splat ?? "",
    );
    if (tree === null) {
      throw notFound();
    }
    return { project, tree };
  },
});
