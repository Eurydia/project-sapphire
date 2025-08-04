import type { ProjectTag } from "#/models/project-tag/project-tag-entity"
import { Stack } from "@mui/material"
import type { FC } from "react"
import { Fragment, memo } from "react"
import { StyledLink } from "../navigation/styled-link"

type InnerProps = {
  fetcher: ProjectTag[]
}
const Inner: FC<InnerProps> = memo(({ fetcher: items }) => {
  if (items.length === 0) {
    return <Fragment />
  }
  return (
    <Stack
      spacing={0.5}
      useFlexGap
      flexWrap="wrap"
      direction="row"
      alignItems="center"
    >
      {items.map(({ name, uuid }) => (
        <StyledLink
          key={`tag-${uuid}`}
          to="/project-tags/$uuid"
          params={{ uuid }}
        >
          {`[${name}]`}
        </StyledLink>
      ))}
    </Stack>
  )
})

type Props = {
  items: ProjectTag[]
}
export const ProjectCardTagList: FC<Props> = memo(
  ({ items }) => {
    return <Inner fetcher={items} />
  },
)
