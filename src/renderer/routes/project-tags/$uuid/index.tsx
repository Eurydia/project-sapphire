import { ProjectTagService } from "@/api/project-tag.service"
import { ProjectService } from "@/api/project.service"
import { ProjectList } from "@/components/data-display/project-list"
import { StyledLink } from "@/components/navigation/styled-link"
import {
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material"
import {
  createFileRoute,
  notFound,
} from "@tanstack/react-router"

export const Route = createFileRoute("/project-tags/$uuid/")({
  component: RouteComponent,
  loader: async ({ params: { uuid } }) => {
    const entry = await ProjectTagService.findByUUID(uuid)
    if (entry === null) {
      throw notFound()
    }
    const projectEntries = await ProjectService.list({
      tags: [entry.name],
    })
    return { entry, projectEntries }
  },
})

function RouteComponent() {
  const { entry, projectEntries } = Route.useLoaderData()
  return (
    <Grid spacing={1} container>
      <Grid size={{ md: 12 }}>
        <Paper>
          <Stack spacing={2}>
            <Stack direction="row" spacing={2} flexWrap="wrap">
              <StyledLink
                to="/project-tags/$uuid/edit"
                params={{ uuid: entry.uuid }}
                sx={{ textDecorationLine: "none" }}
              >
                {`[EDIT]`}
              </StyledLink>
            </Stack>
            <Divider flexItem />
            <Stack spacing={0.5}>
              <Typography variant="h4">{entry.name}</Typography>
              {entry.description.trim().length > 0 && (
                <Typography>{entry.description}</Typography>
              )}
            </Stack>
          </Stack>
        </Paper>
      </Grid>
      <Grid size={{ md: 3 }}>
        <Paper>
          <Stack spacing={0.5}>
            <Stack spacing={2} direction="row">
              <StyledLink
                to="."
                sx={{ textDecorationLine: "none" }}
              >
                {`[PREV]`}
              </StyledLink>
              <StyledLink
                to="."
                sx={{ textDecorationLine: "none" }}
              >
                {`[NEXT]`}
              </StyledLink>
            </Stack>
            <Typography>{`SHOWING: 0-0 OF 0`}</Typography>
            <Typography>{`PAGE: 1 OF 1`}</Typography>
          </Stack>
        </Paper>
      </Grid>
      <Grid size={{ md: 9 }}>
        <ProjectList projects={projectEntries} />
      </Grid>
    </Grid>
  )
}
