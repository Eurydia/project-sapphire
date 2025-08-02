import { ProjectTechnologyService } from "@/api/project-technology.service"
import { Grid, Paper, Stack, Typography } from "@mui/material"
import { createFileRoute } from "@tanstack/react-router"
import { memo, type FC } from "react"

const RouteComponent: FC = memo(() => {
  const { techs } = Route.useLoaderData()
  return (
    <Grid spacing={1} container>
      <Grid size={{ md: 3 }} />
      <Grid size={{ md: "grow" }}>
        <Stack spacing={1}>
          {techs.map((tech) => (
            <Paper variant="outlined" key={tech.uuid}>
              <Typography>{tech.name}</Typography>
            </Paper>
          ))}
        </Stack>
      </Grid>
    </Grid>
  )
})

export const Route = createFileRoute("/project-technologies/")({
  component: RouteComponent,
  loader: async () => {
    const techs = await ProjectTechnologyService.list()
    return { techs }
  },
})
