import { Stack, Typography, useTheme } from "@mui/material"
import { useNavigate } from "@tanstack/react-router"
import type { FC } from "react"
import { Fragment, memo, useCallback } from "react"
import type { ProjectGroupTableEntity } from "~/db/models/project-group/group-table-entity"
import { StyledLink } from "../navigation/styled-link"

type InnerProps = {
  fetcher: ProjectGroupTableEntity[]
}
const Inner: FC<InnerProps> = memo(({ fetcher: items }) => {
  const { palette } = useTheme()
  const navigate = useNavigate()

  const onClickHandleProvider = useCallback(
    (uuid: string) => () => {
      navigate({ to: "/topics", hash: uuid })
    },
    [navigate],
  )
  if (items.length === 0) {
    return (
      <Typography variant="subtitle2" color="textSecondary">
        {`not set`}
      </Typography>
    )
  }
  return (
    <Fragment>
      {items.map(({ uuid, name, color }, index) => (
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
