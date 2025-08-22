import { FileSystemService } from "@/api/file-system.service"
import { ProjectRepositoryService } from "@/api/project-repository.service"
import { ProjectService } from "@/api/project.service"
import { ProjectCardMetadata } from "@/components/data-display/project-card-metadata"
import { ProjectCardTagList } from "@/components/data-display/project-card-tag-list"
import { ProjectWorkspaceTable } from "@/components/data-display/project-workspace-table"
import { ProjectDeleteForm } from "@/components/form/project-form.delete"
import { ProjectRepositoryForm } from "@/components/form/project-repository.form"
import { TypographyButton } from "@/components/input/typography-button"
import { StyledLink } from "@/components/navigation/styled-link"
import {
  Dialog,
  DialogContent,
  Divider,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material"
import {
  createFileRoute,
  notFound,
  useRouter,
} from "@tanstack/react-router"
import { isLeft, isRight } from "fp-ts/lib/Either"
import moment from "moment"
import type { FC } from "react"
import { Fragment, memo, useState } from "react"

export const RouteComponent: FC = memo(() => {
  const { project } = Route.useLoaderData()
  const router = useRouter()
  const navigate = Route.useNavigate()
  const [repoDialogVisible, setRepoDialogVisible] =
    useState(false)
  const [wsDialogVisible, setWsDialogVisible] = useState(false)
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
                    onClick={() => {
                      if (project.pinned) {
                        ProjectService.unpin(project.uuid)
                      } else {
                        ProjectService.pin(project.uuid)
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
              <Typography component="pre">
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
              <Stack spacing={2}>
                <TypographyButton
                  onClick={() => setRepoDialogVisible(true)}
                >
                  [ADD]
                </TypographyButton>
                <Divider flexItem />
                <Typography variant="h4">
                  REPOSITORIES
                </Typography>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>{`NAME`}</TableCell>
                      <TableCell align="right">{`CREATED`}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {project.repositories.map((repo) => (
                      <TableRow key={repo.uuid}>
                        <TableCell>
                          <TypographyButton
                            onClick={() => {
                              FileSystemService.openURL(repo.url)
                            }}
                          >
                            {repo.name}
                          </TypographyButton>
                        </TableCell>
                        <TableCell align="right">
                          {moment(repo.createdAt)
                            .toDate()
                            .toDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Stack>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
      <Dialog
        open={repoDialogVisible}
        onClose={() => setRepoDialogVisible(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          <ProjectRepositoryForm
            onSubmit={async (formData) => {
              const result =
                await ProjectRepositoryService.create({
                  projectUUID: project.uuid,
                  ...formData,
                })
              if (isRight(result)) {
                setRepoDialogVisible(false)
                await router.invalidate()
              }
            }}
          />
        </DialogContent>
      </Dialog>
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
