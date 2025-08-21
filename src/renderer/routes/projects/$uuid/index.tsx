import type { ProjectRepository } from "#/models/project-repository/project-repository"
import type { ProjectWorkspace } from "#/models/project-workspace/project-workspace"
import type { Project } from "#/models/project/project"
import { FileSystemService } from "@/api/file-system.service"
import { ProjectRepositoryService } from "@/api/project-repository.service"
import { ProjectWorkspaceService } from "@/api/project-workspace.service"
import { ProjectService } from "@/api/project.service"
import { ProjectCardMetadata } from "@/components/data-display/project-card-metadata"
import { ProjectCardTagList } from "@/components/data-display/project-card-tag-list"
import { ProjectRepositoryForm } from "@/components/form/project-repository.form"
import { ProjectWorkspaceForm } from "@/components/form/project-workspace.form"
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

const RepoCard: FC<{
  project: Project
  repo: ProjectRepository
}> = ({ repo, project }) => {
  const [dialogOpen, setDialogVisible] = useState(false)
  const router = useRouter()
  return (
    <Fragment key={repo.uuid}>
      <Stack direction="row" justifyContent="space-between">
        <TypographyButton
          onClick={() => {
            FileSystemService.openURL(repo.url)
          }}
          slotProps={{
            typography: { variant: "h5" },
          }}
        >
          {repo.name}
        </TypographyButton>
        <TypographyButton onClick={() => setDialogVisible(true)}>
          [EDIT]
        </TypographyButton>
      </Stack>
      <Dialog
        open={dialogOpen}
        maxWidth="md"
        fullWidth
        onClose={() => setDialogVisible(false)}
      >
        <DialogContent>
          <ProjectRepositoryForm
            init={repo}
            onSubmit={async (formData) => {
              const result =
                await ProjectRepositoryService.update({
                  projectUUID: project.uuid,
                  uuid: repo.uuid,
                  ...formData,
                })
              if (isRight(result)) {
                setDialogVisible(false)
                await router.invalidate()
              }
            }}
          />
        </DialogContent>
      </Dialog>
    </Fragment>
  )
}

const WsCard: FC<{
  project: Project
  ws: ProjectWorkspace
}> = ({ ws, project }) => {
  const [dialogOpen, setDialogVisible] = useState(false)
  const router = useRouter()
  return (
    <Fragment key={ws.uuid}>
      <Stack direction="row" justifyContent="space-between">
        <TypographyButton
          onClick={() => {
            FileSystemService.openPath(ws.root)
          }}
          slotProps={{
            typography: { variant: "h5" },
          }}
        >
          {ws.name}
        </TypographyButton>
        <TypographyButton onClick={() => setDialogVisible(true)}>
          [EDIT]
        </TypographyButton>
      </Stack>
      <Dialog
        open={dialogOpen}
        maxWidth="md"
        fullWidth
        onClose={() => setDialogVisible(false)}
      >
        <DialogContent>
          <ProjectWorkspaceForm
            init={ws}
            onSubmit={async (formData) => {
              const result =
                await ProjectWorkspaceService.update({
                  projectUUID: project.uuid,
                  uuid: ws.uuid,
                  ...formData,
                })
              if (isRight(result)) {
                setDialogVisible(false)
                await router.invalidate()
              }
            }}
          />
        </DialogContent>
      </Dialog>
    </Fragment>
  )
}

export const RouteComponent: FC = memo(() => {
  const { project } = Route.useLoaderData()
  const router = useRouter()
  const [repoDialogVisible, setRepoDialogVisible] =
    useState(false)
  const [wsDialogVisible, setWsDialogVisible] = useState(false)
  return (
    <Fragment>
      <Grid container spacing={1} maxWidth="md" marginX="auto">
        <Grid size={{ md: 12 }}>
          <Paper variant="outlined">
            <Stack spacing={2}>
              <Stack direction="row" spacing={2}>
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
              <Stack spacing={2}>
                <TypographyButton
                  onClick={() => setWsDialogVisible(true)}
                >
                  [ADD]
                </TypographyButton>
                <Divider flexItem />
                <Typography variant="h4">WORKSPACES</Typography>
                <Stack
                  spacing={1}
                  divider={<Divider flexItem />}
                >
                  {project.workspaces.map((ws) => (
                    <WsCard
                      key={ws.uuid}
                      project={project}
                      ws={ws}
                    />
                  ))}
                </Stack>
              </Stack>
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
                <Stack
                  spacing={1}
                  divider={<Divider flexItem />}
                >
                  {project.repositories.map((repo) => (
                    <RepoCard
                      key={repo.uuid}
                      project={project}
                      repo={repo}
                    />
                  ))}
                </Stack>
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
        open={wsDialogVisible}
        onClose={() => setWsDialogVisible(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          <ProjectWorkspaceForm
            onSubmit={async (formData) => {
              const result =
                await ProjectWorkspaceService.create({
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
