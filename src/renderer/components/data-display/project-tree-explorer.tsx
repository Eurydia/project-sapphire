import type { ProjectTree } from "#/models/project-tree/project-tree"
import { FileSystemService } from "@/api/file-system.service"
import { Divider, Stack } from "@mui/material"
import { memo, type FC } from "react"
import { TypographyButton } from "../input/typography-button"
import { StyledLink } from "../navigation/styled-link"

type Props = {
  tree: ProjectTree
}
export const ProjectTreeExplorer: FC<Props> = memo(
  ({ tree: { dirs, files, parentPath, path, projectUuid } }) => {
    return (
      <Stack divider={<Divider flexItem />} spacing={2}>
        {dirs.map((name, i) => (
          <StyledLink
            key={`dir-${i}`}
            to="/projects/$uuid/tree/$"
            params={{
              uuid: projectUuid,
              _splat: path !== null ? `${path}/${name}` : name,
            }}
          >
            {`${name}/`}
          </StyledLink>
        ))}
        {files.map((name, i) => (
          <Stack
            key={`file-${i}`}
            direction="row"
            justifyContent={"space-between"}
            spacing={2}
          >
            <TypographyButton
              onClick={async () =>
                FileSystemService.openPath(parentPath, name)
              }
            >
              {name}
            </TypographyButton>
          </Stack>
        ))}
      </Stack>
    )
  },
)
