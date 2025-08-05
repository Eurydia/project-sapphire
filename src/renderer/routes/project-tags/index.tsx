import { ProjectTagService } from "@/api/project-group.service"
import { TagCard } from "@/components/data-display/tag-card"
import { Grid, Stack } from "@mui/material"
import { createFileRoute } from "@tanstack/react-router"
import { memo, type FC } from "react"

const RouteComponent: FC = memo(() => {
  const { tags } = Route.useLoaderData()
  return (
    <Grid spacing={1} container>
      <Grid size={{ md: 3 }} />
      <Grid size={{ md: "grow" }}>
        <Stack spacing={1}>
          {tags.map((tag) => (
            <TagCard tag={tag} key={tag.uuid} />
          ))}
        </Stack>
      </Grid>
    </Grid>
  )
})

export const Route = createFileRoute("/project-tags/")({
  component: RouteComponent,
  loader: async () => {
    const tags = await ProjectTagService.list()
    return { tags }
  },
})
