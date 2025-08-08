import { projectTagPaginationQueryDtoSchema } from "#/models/project-tag/dto/pagination-project-tag.dto"
import { ProjectTagService } from "@/api/project-tag.service"
import { ProjectService } from "@/api/project.service"
import { TagCard } from "@/components/data-display/tag-card"
import { TypographyButton } from "@/components/input/typography-button"
import { StyledLink } from "@/components/navigation/styled-link"
import {
  Autocomplete,
  Divider,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import {
  createFileRoute,
  useNavigate,
} from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
import { useRef, useState, type FC } from "react"
import { useHotkeys } from "react-hotkeys-hook"

const RouteComponent: FC = () => {
  const {
    items,
    pageCount,
    pageIndex,
    resultsPerPage,
    total,
    options,
  } = Route.useLoaderData()
  const navigate = useNavigate()
  const [queryString, setQueryString] = useState<
    {
      label: string
      value: string
    }[]
  >([])
  const ref = useRef<HTMLInputElement>(null)
  useHotkeys("ctrl+k", () => {
    if (ref.current !== null) {
      ref.current.focus()
    }
  })
  return (
    <Grid spacing={1} container>
      <Grid size={12}>
        <Paper>
          <Stack spacing={1} alignItems="start">
            <Autocomplete
              popupIcon={false}
              fullWidth
              multiple
              options={[
                ...options.names.map((name) => ({
                  label: `name:"${name}"`,
                  value: `name:${name}`,
                })),
                ...options.projectNames.map((name) => ({
                  label: `project:"${name}"`,
                  value: `project:${name}`,
                })),
              ]}
              value={queryString}
              onChange={(_, v) => setQueryString(v)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  inputRef={ref}
                  placeholder={
                    queryString.length === 0
                      ? "[CTRL] + [K]"
                      : undefined
                  }
                />
              )}
              slotProps={{
                chip: {
                  variant: "outlined",
                  onDelete: undefined,
                  sx: {
                    fontSize: (theme) =>
                      theme.typography.body1.fontSize,
                  },
                },
              }}
            />
            <StyledLink
              to="."
              search={{
                query: queryString.map(({ value }) => value),
                pageIndex,
                resultsPerPage,
              }}
              sx={{ textDecorationLine: "none" }}
            >
              {`[SUBMIT]`}
            </StyledLink>
          </Stack>
        </Paper>
      </Grid>
      <Grid size={{ md: 3 }}>
        <Paper>
          <Stack
            alignItems="flex-start"
            spacing={2}
            divider={<Divider flexItem />}
          >
            <TypographyButton
              onClick={() =>
                navigate({ to: "/project-tags/create" })
              }
            >
              {`[ADD]`}
            </TypographyButton>
            <Stack spacing={0.5}>
              <Typography>{`SHOWING: ${pageIndex * resultsPerPage + 1}-${pageIndex * resultsPerPage + (resultsPerPage > items.length ? items.length : resultsPerPage)} OF ${total}`}</Typography>
              <Typography>{`PAGE: ${pageIndex + 1} OF ${pageCount}`}</Typography>
              <Stack spacing={2} direction="row">
                <StyledLink
                  to="."
                  search={{
                    query: queryString.map(({ value }) => value),
                    resultsPerPage,
                    pageIndex: Math.max(0, pageIndex - 1),
                  }}
                  sx={{ textDecorationLine: "none" }}
                >
                  {`[PREV]`}
                </StyledLink>
                <StyledLink
                  to="."
                  search={{
                    query: queryString.map(({ value }) => value),
                    resultsPerPage,
                    pageIndex: Math.min(
                      pageIndex + 1,
                      pageCount - 1,
                    ),
                  }}
                  sx={{ textDecorationLine: "none" }}
                >
                  {`[NEXT]`}
                </StyledLink>
              </Stack>
            </Stack>
          </Stack>
        </Paper>
      </Grid>
      <Grid size={{ md: "grow" }}>
        <Stack spacing={1}>
          {items.map((tag) => (
            <TagCard tag={tag} key={tag.uuid} />
          ))}
        </Stack>
      </Grid>
    </Grid>
  )
}

export const Route = createFileRoute("/project-tags/")({
  component: RouteComponent,
  validateSearch: zodValidator(
    projectTagPaginationQueryDtoSchema,
  ),
  loaderDeps: ({ search }) => ({ search }),
  loader: async ({ deps: { search } }) => {
    const result = await ProjectTagService.list(search)
    const names = await ProjectTagService.listNames()
    const projectNames = await ProjectService.listNames()
    return { ...result, options: { names, projectNames } }
  },
})
