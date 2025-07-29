import { Stack, Typography } from "@mui/material"
import type { FC } from "react"
import { Fragment, memo } from "react"
import type { Technology } from "~/db/models/technology/tech-table-entity"
import { StyledLink } from "../navigation/styled-link"

type InnerProps = {
  fetcher: Technology[]
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
      {items.map(({ uuid, name }) => (
        <StyledLink
          key={uuid}
          to="/technologies"
          sx={{ textDecorationLine: "none" }}
        >
          {`[ ${name} ]`}
        </StyledLink>
      ))}
    </Fragment>
  )
})

type Props = {
  items: Technology[]
}
export const ProjectCardTechList: FC<Props> = memo(
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
          {`tech(s):`}
        </Typography>
        <Inner fetcher={items} />
      </Stack>
    )
  },
)
