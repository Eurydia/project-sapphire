import { FolderRounded } from "@mui/icons-material"
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material"
import { memo, type FC } from "react"
import type { Project } from "~/db/models/project/project"
import { StyledLink } from "../navigation/styled-link"

type Props = {
  path: string
  files: string[]
  dirs: string[]
  project: Project
}
export const ProjectTreeExplorer: FC<Props> = memo(
  ({ project, dirs, files, path }) => {
    return (
      <List>
        {dirs.map((name, i) => (
          <ListItem key={`dir-${i}`}>
            <ListItemIcon>
              <FolderRounded />
            </ListItemIcon>
            <ListItemText disableTypography>
              <StyledLink
                to="/projects/$uuid/tree/$"
                params={{ uuid: project.uuid, _splat: name }}
              >
                {name}
              </StyledLink>
            </ListItemText>
          </ListItem>
        ))}
        {files.map((name, i) => (
          <ListItem key={`file-${i}`}>
            <ListItemIcon />
            <ListItemText disableTypography>{name}</ListItemText>
          </ListItem>
        ))}
      </List>
    )
  },
)
