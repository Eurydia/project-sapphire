import { projectTagPaginationQueryDtoSchema } from "#/models/project-tag/dto/pagination-project-tag.dto"
import { ProjectTagService } from "@/api/project-tag.service"
import { TagCard } from "@/components/data-display/tag-card"
import { TypographyButton } from "@/components/input/typography-button"
import {
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material"
import {
  createFileRoute,
  useNavigate,
} from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
import { range } from "lodash"
import { type FC } from "react"

const RouteComponent: FC = () => {
  const { items, pageCount, pageIndex, resultsPerPage, total } =
    Route.useLoaderData()
  const navigate = useNavigate()
  return (
    <Grid spacing={1} container>
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
              <Stack>
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
              <Stack direction="row" spacing={2} flexWrap="wrap">
                {range(pageCount).map((index) =>
                  index === pageIndex ? (
                    <Typography
                      key={`page-${index}`}
                      fontWeight={900}
                    >
                      {`${pageIndex + 1}`}
                    </Typography>
                  ) : (
                    <TypographyButton
                      key={`page-${index}`}
                      onClick={() =>
                        navigate({
                          to: ".",
                          search: { pageIndex: index },
                        })
                      }
                    >
                      {`[${index + 1}]`}
                    </TypographyButton>
                  ),
                )}
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
    return result
  },
})
