import { ProjectService } from "@/api/project.service"
import { ProjectCardMetadata } from "@/components/data-display/project-card-metadata"
import { ProjectCardTagList } from "@/components/data-display/project-card-tag-list"
import { ProjectRepositoryTable } from "@/components/data-display/project-repository-table"
import { ProjectWorkspaceTable } from "@/components/data-display/project-workspace-table"
import { ProjectDeleteForm } from "@/components/form/project-form.delete"
import { TypographyButton } from "@/components/input/typography-button"
import { StyledLink } from "@/components/navigation/styled-link"
import {
  Dialog,
  DialogContent,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material"
import {
  createFileRoute,
  notFound,
  useRouter,
} from "@tanstack/react-router"
import { isLeft, isRight } from "fp-ts/lib/Either"
import type { FC } from "react"
import { Fragment, memo, useState } from "react"

export const RouteComponent: FC = memo(() => {
  const { project } = Route.useLoaderData()
  const navigate = Route.useNavigate()
  const router = useRouter()
  const [deleteDialogActive, setDeleteDialogActive] =
    useState(false)
  return (
    <Fragment>
      <Grid container spacing={1} maxWidth="md" marginX="auto">
        <Grid size={{ md: 12 }}>
          <Paper variant="outlined">
            <Stack spacing={2}>
              <Stack
                direction="row"
                spacing={2}
                justifyContent="space-between"
              >
                <Stack spacing={2} direction="row">
                  <TypographyButton
                    onClick={async () => {
                      if (project.pinned) {
                        const result =
                          await ProjectService.unpin(
                            project.uuid,
                          )
                        if (isRight(result)) {
                          router.invalidate()
                        }
                      } else {
                        const result = await ProjectService.pin(
                          project.uuid,
                        )
                        if (isRight(result)) {
                          router.invalidate()
                        }
                      }
                    }}
                  >
                    {project.pinned ? "[UNPIN]" : "[PIN]"}
                  </TypographyButton>
                  <StyledLink
                    to="/projects/$uuid/edit"
                    params={{ uuid: project.uuid }}
                  >
                    {`[EDIT]`}
                  </StyledLink>
                </Stack>
                <TypographyButton
                  onClick={() => setDeleteDialogActive(true)}
                  slotProps={{
                    typography: {
                      sx: {
                        color: ({ palette: { error } }) =>
                          error.light,
                      },
                    },
                  }}
                >
                  [DELETE]
                </TypographyButton>
              </Stack>
              <Divider flexItem />
              <Typography variant="h3">
                {project.name}
              </Typography>
              <Typography
                sx={{
                  wordWrap: "normal",
                  whiteSpace: "pre-line",
                }}
              >
                {project.description}
              </Typography>
              <ProjectCardMetadata project={project} />
              <ProjectCardTagList project={project} />
            </Stack>
          </Paper>
        </Grid>
        <Grid size={{ md: 12 }}>
          <Stack spacing={2}>
            <Paper>
              <ProjectWorkspaceTable project={project} />
            </Paper>
            <Paper>
              <ProjectRepositoryTable project={project} />
            </Paper>
          </Stack>
        </Grid>
      </Grid>
      <Dialog
        open={deleteDialogActive}
        onClose={() => setDeleteDialogActive(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogContent>
          <ProjectDeleteForm
            uuid={project.uuid}
            onSubmit={async () => {
              setDeleteDialogActive(false)
              ProjectService.deleteByUUID(project.uuid).then(
                async (resp) => {
                  if (isRight(resp)) {
                    await navigate({ to: "/projects" })
                  }
                },
              )
            }}
          />
        </DialogContent>
      </Dialog>
    </Fragment>
  )
})

export const Route = createFileRoute("/projects/$uuid/")({
  component: RouteComponent,
  loader: async ({ params: { uuid } }) => {
    const result = await ProjectService.findByUuid(uuid)
    if (isLeft(result)) {
      throw notFound()
    }
    return { project: result.right }
  },
})
