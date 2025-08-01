import { Stack, Typography } from "@mui/material"
import type { FC } from "react"
import { Fragment, memo } from "react"
import type { ProjectGroupTableEntity } from "src/shared/models/project-group/group-table-entity"
import { StyledLink } from "../navigation/styled-link"

type InnerProps = {
  fetcher: ProjectGroupTableEntity[]
}
const Inner: FC<InnerProps> = memo(({ fetcher: items }) => {
  if (items.length === 0) {
    return (
      <Typography variant="subtitle2" color="textSecondary">
        {`not set`}
      </Typography>
    )
  }
  return (
    <Fragment>
      {items.map(({ name }, index) => (
        <StyledLink key={`tag-item[${index}]`} to="/projects">
          {name}
        </StyledLink>
      ))}
    </Fragment>
  )
})

type Props = {
  items: ProjectGroupTableEntity[]
}
export const ProjectCardGroupList: FC<Props> = memo(
  ({ items }) => {
    return (
      <Stack
        spacing={0.5}
        useFlexGap
        flexWrap="wrap"
        direction="row"
        alignItems="center"
      >
        <Typography variant="subtitle2" color="textSecondary">
          {`group(s):`}
        </Typography>
        <Inner fetcher={items} />
      </Stack>
    )
  },
)
