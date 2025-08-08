import { projectTagPaginationQueryDtoSchema } from "#/models/project-tag/dto/pagination-project-tag.dto"
import { ProjectTagService } from "@/api/project-tag.service"
import { TagCard } from "@/components/data-display/tag-card"
import { TypographyButton } from "@/components/input/typography-button"
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
  const [queryString, setQueryString] = useState<string[]>([])
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
          <Stack spacing={1}>
            <Autocomplete
              popupIcon={false}
              fullWidth
              multiple
              options={options.names.map(
                (name) => `name:${name}`,
              )}
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
            <TypographyButton
              onClick={() =>
                navigate({
                  to: ".",
                  search: {
                    query: queryString,
                  },
                })
              }
            >
              [SUBMIT]
            </TypographyButton>
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
              <Typography>{`SHOWING: ${pageIndex * resultsPerPage + 1}-${pageIndex * resultsPerPage + resultsPerPage} OF ${total}`}</Typography>
              <Typography>{`PAGE: ${pageIndex + 1} OF ${pageCount}`}</Typography>
              <Stack spacing={2} direction="row">
                <TypographyButton
                  onClick={() => {
                    if (pageIndex === 0) {
                      return
                    }
                    navigate({
                      to: ".",
                      search: {
                        resultsPerPage,
                        pageIndex: pageIndex - 1,
                      },
                    })
                  }}
                >
                  {`[PREV]`}
                </TypographyButton>
                <TypographyButton
                  onClick={() => {
                    if (pageIndex === pageCount - 1) {
                      return
                    }
                    navigate({
                      to: ".",
                      search: {
                        resultsPerPage,
                        pageIndex: pageIndex + 1,
                      },
                    })
                  }}
                >
                  {`[NEXT]`}
                </TypographyButton>
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
    return { ...result, options: { names } }
  },
})
