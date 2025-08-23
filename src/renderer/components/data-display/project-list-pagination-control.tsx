import type { Project } from "#/models/project/project"
import { Stack, Typography } from "@mui/material"
import type { FC } from "react"

type Props = {
  projects: Project[]
}
export const ProjectListPaginationControl: FC<Props> = ({
  projects: items,
}) => {
  return (
    <Stack spacing={1}>
      <Typography>{`FOUND: ${items.length} ${items.length > 1 ? "ENTRIES" : "ENTRY"}`}</Typography>
    </Stack>
  )
}
