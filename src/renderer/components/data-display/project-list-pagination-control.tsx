import type { ProjectTagPaginationQueryDto } from "#/models/project-tag/dto/pagination-project-tag.dto"
import type { ProjectPaginationResult } from "#/models/project/dto/pagination-project.dto"
import { Stack, Typography } from "@mui/material"
import type { FC } from "react"
import { StyledLink } from "../navigation/styled-link"

type Props = {
  query: ProjectTagPaginationQueryDto["query"]
  pagination: ProjectPaginationResult
}
export const ProjectListPaginationControl: FC<Props> = ({
  pagination,
  query,
}) => {
  const {
    items,
    pageCount,
    pageIndex,
    resultsPerPage,
    totalCount,
  } = pagination
  const entryStart = pageIndex * resultsPerPage + 1
  let entryEnd = pageIndex * resultsPerPage
  entryEnd +=
    resultsPerPage > items.length ? items.length : resultsPerPage
  return (
    <Stack spacing={0.5}>
      <Typography>{`SHOWING: ${entryStart}-${entryEnd} OF ${totalCount}`}</Typography>
      <Typography>{`PAGE: ${pageIndex + 1} OF ${pageCount}`}</Typography>
      <Stack spacing={2} direction="row">
        <StyledLink
          to="."
          search={{
            query,
            resultsPerPage: resultsPerPage,
            pageIndex: Math.max(0, pageIndex - 1),
          }}
          sx={{ textDecorationLine: "none" }}
        >
          {`[PREV]`}
        </StyledLink>
        <StyledLink
          to="."
          search={{
            query,
            resultsPerPage: resultsPerPage,
            pageIndex: Math.min(pageIndex + 1, pageCount - 1),
          }}
          sx={{ textDecorationLine: "none" }}
        >
          {`[NEXT]`}
        </StyledLink>
      </Stack>
    </Stack>
  )
}
