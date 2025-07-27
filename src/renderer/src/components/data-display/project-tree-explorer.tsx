import { FolderRounded } from "@mui/icons-material"
import {
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material"
import { useRouter } from "@tanstack/react-router"
import { memo, type FC } from "react"
import { openPath } from "~/api/fs"
import type { ProjectTree } from "~/db/models/project-tree/project-tree"
import { upsertTree } from "~/db/project-trees"
import { StyledLink } from "../navigation/styled-link"

type Props = {
  tree: ProjectTree
}
export const ProjectTreeExplorer: FC<Props> = memo(
  ({
    tree: { dirs, files, parentPath, path, projectUuid, readme },
  }) => {
    const router = useRouter()
    return (
      <Stack>
        <List>
          {dirs.map((name, i) => (
            <ListItem key={`dir-${i}`}>
              <ListItemIcon>
                <FolderRounded />
              </ListItemIcon>
              <ListItemText disableTypography>
                <StyledLink
                  to="/projects/$uuid/tree/$"
                  params={{
                    uuid: projectUuid,
                    _splat: `${path}/${name}`,
                  }}
                >
                  {name}
                </StyledLink>
              </ListItemText>
            </ListItem>
          ))}
          {files.map((name, i) => (
            <ListItem key={`file-${i}`}>
              <ListItemIcon />
              <ListItemText disableTypography>
                <Typography
                  component="div"
                  onClick={() => openPath(parentPath, name)}
                >
                  {name}
                </Typography>
                <Button
                  onClick={() =>
                    upsertTree({
                      path,
                      projectUuid: projectUuid,
                      readme:
                        readme !== null && readme.name === name
                          ? null
                          : name,
                    }).then(() => router.invalidate())
                  }
                >
                  {readme !== null && readme.name === name
                    ? "unset"
                    : "set"}
                </Button>
              </ListItemText>
            </ListItem>
          ))}
        </List>
        <Typography>{readme?.content ?? "???"}</Typography>
      </Stack>
    )
  },
)
