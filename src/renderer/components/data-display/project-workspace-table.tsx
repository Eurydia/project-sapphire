import type { Project } from "#/models/project/project"
import { FileSystemService } from "@/api/file-system.service"
import { ProjectWorkspaceService } from "@/api/project-workspace.service"
import {
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material"
import { useRouter } from "@tanstack/react-router"
import { isRight } from "fp-ts/lib/Either"
import moment from "moment"
import { Fragment, useState, type FC } from "react"
import { ProjectWorkspaceForm } from "../form/project-workspace.form"
import { TypographyButton } from "../input/typography-button"

type TableRowProps = {
  projectUUID: string
  ws: Project["workspaces"][number]
}
const WsTableRow: FC<TableRowProps> = ({ projectUUID, ws }) => {
  const [editDialogActive, setEditDialogActive] = useState(false)
  const [deleteDialogActive, setDeleteDialogActive] =
    useState(false)
  const router = useRouter()
  return (
    <Fragment>
      <TableRow key={ws.uuid}>
        <TableCell>
          <Stack spacing={1}>
            <TypographyButton
              onClick={() => {
                FileSystemService.openPath(ws.root)
              }}
            >
              {`${ws.name}/`}
            </TypographyButton>
            <Stack spacing={2} direction="row">
              <TypographyButton
                slotProps={{
                  typography: { fontSize: "inherit" },
                }}
                onClick={() => {
                  setEditDialogActive(true)
                }}
              >
                [EDIT]
              </TypographyButton>
              <TypographyButton
                slotProps={{
                  typography: { fontSize: "inherit" },
                }}
                onClick={() => {
                  setDeleteDialogActive(true)
                }}
              >
                [REMOVE]
              </TypographyButton>
            </Stack>
          </Stack>
        </TableCell>
        <TableCell align="right">
          {moment(ws.createdAt).toDate().toDateString()}
        </TableCell>
      </TableRow>
      <Dialog
        open={editDialogActive}
        onClose={() => {
          setEditDialogActive(false)
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          <ProjectWorkspaceForm
            init={ws}
            onSubmit={async (formData) => {
              const result =
                await ProjectWorkspaceService.update({
                  projectUUID: projectUUID,
                  uuid: ws.uuid,
                  ...formData,
                }).finally(() => {
                  setEditDialogActive(false)
                })
              if (isRight(result)) {
                await router.invalidate()
              }
            }}
          />
        </DialogContent>
      </Dialog>
      <Dialog
        open={deleteDialogActive}
        fullWidth
        maxWidth="md"
        onClose={() => setDeleteDialogActive(false)}
      >
        <DialogContent>{`REMOVE "${ws.name}" FROM PROJECT`}</DialogContent>
        <DialogActions>
          <TypographyButton
            slotProps={{
              typography: {
                sx: {
                  color: ({ palette }) => palette.error.main,
                  "&:hover": ({ palette }) => ({
                    color: palette.error.light,
                  }),
                },
              },
            }}
            onClick={async () => {
              const result =
                await ProjectWorkspaceService.deleteByUUID(
                  ws.uuid,
                ).finally(() => setDeleteDialogActive(false))
              if (isRight(result)) {
                await router.invalidate()
              }
            }}
          >
            [CONFIRM]
          </TypographyButton>
          <TypographyButton
            onClick={() => setDeleteDialogActive(false)}
          >
            [CANCEL]
          </TypographyButton>
        </DialogActions>
      </Dialog>
    </Fragment>
  )
}

type Props = { project: Project }
export const ProjectWorkspaceTable: FC<Props> = ({
  project,
}) => {
  const router = useRouter()
  const [createDialogActive, setCreateDialogActive] =
    useState(false)

  return (
    <Fragment>
      <Stack spacing={2}>
        <TypographyButton
          onClick={() => setCreateDialogActive(true)}
        >
          [ADD]
        </TypographyButton>
        <Divider flexItem />
        <Typography variant="h4">WORKSPACES</Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{`NAME`}</TableCell>
              <TableCell align="right">{`ADDED`}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {project.workspaces.map((ws) => (
              <WsTableRow
                ws={ws}
                key={ws.uuid}
                projectUUID={project.uuid}
              />
            ))}
          </TableBody>
        </Table>
      </Stack>
      <Dialog
        open={createDialogActive}
        onClose={() => setCreateDialogActive(false)}
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
                setCreateDialogActive(false)
                await router.invalidate()
              }
            }}
          />
        </DialogContent>
      </Dialog>
    </Fragment>
  )
}
