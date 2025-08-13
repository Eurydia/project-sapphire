import type {
  ProjectPaginationQuery,
  ProjectPaginationResult,
} from "#/models/project/dto/pagination-project.dto"
import { Stack, Typography } from "@mui/material"
import { range } from "lodash"
import type { FC } from "react"
import { StyledLink } from "../navigation/styled-link"

type Props = {
  search: ProjectPaginationQuery
  pagination: ProjectPaginationResult
}
export const ProjectListPaginationControl: FC<Props> = ({
  pagination,
  search,
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
  if (resultsPerPage > items.length) {
    entryEnd += items.length
  } else {
    entryEnd += resultsPerPage
  }
  return (
    <Stack spacing={1}>
      <Stack>
        <Typography>{`ORDER BY`}</Typography>
        <Stack spacing={2} direction="row" flexWrap="wrap">
          {[
            { value: "lastVisited", label: "LAST VISITED" },
            { value: "name", label: "NAME" },
          ].map(({ value, label }) => {
            if (value === search.orderBy) {
              return (
                <Typography key={`order-${value}`}>
                  {label}
                </Typography>
              )
            }
            return (
              <StyledLink
                to="/projects"
                search={{
                  ...search,
                  orderBy:
                    value as ProjectPaginationQuery["orderBy"],
                }}
                key={`order-${value}`}
              >
                {`[${label}]`}
              </StyledLink>
            )
          })}
        </Stack>
      </Stack>

      <Stack>
        <Typography>{`SHOWING: ${entryStart}-${entryEnd} OF ${totalCount}`}</Typography>
        <Stack direction="row" spacing={2}>
          <Stack spacing={2} direction="row" flexWrap="wrap">
            {range(5, 20, 5).map((size) => {
              if (size === search.resultsPerPage) {
                return (
                  <Typography key={`size-${size}`}>
                    {size}
                  </Typography>
                )
              }
              return (
                <StyledLink
                  to="/projects"
                  search={{
                    ...search,
                    resultsPerPage: size,
                  }}
                  key={`size-${size}`}
                >
                  {`[${size}]`}
                </StyledLink>
              )
            })}
          </Stack>
        </Stack>
      </Stack>
      <Stack>
        <Typography>{`PAGE: ${pageIndex + 1} OF ${pageCount}`}</Typography>
        <Stack spacing={2} direction="row">
          <StyledLink
            to="."
            search={{
              ...search,
              pageIndex: Math.max(0, pageIndex - 1),
            }}
          >
            {`[PREV]`}
          </StyledLink>
          <StyledLink
            to="."
            search={{
              ...search,
              pageIndex: Math.min(pageIndex + 1, pageCount - 1),
            }}
          >
            {`[NEXT]`}
          </StyledLink>
        </Stack>
      </Stack>
    </Stack>
  )
}
