import { Divider, Link, Stack, Typography } from "@mui/material"
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
      <Stack divider={<Divider flexItem />} spacing={2}>
        {dirs.map((name, i) => (
          <StyledLink
            key={`dir-${i}`}
            to="/projects/$uuid/tree/$"
            params={{
              uuid: projectUuid,
              _splat: path !== "" ? `${path}/${name}` : name,
            }}
          >
            {`${name}/`}
          </StyledLink>
        ))}
        {files.map((name, i) => (
          <Stack key={`file-${i}`} spacing={0.5}>
            <Typography
              onClick={() => openPath(parentPath, name)}
              sx={{
                cursor: "pointer",
                textDecorationLine: "underline",
              }}
            >
              {name}
            </Typography>
            <Stack
              spacing={2}
              direction="row"
              divider={
                <Divider flexItem orientation="vertical" />
              }
            >
              <Link
                sx={{ cursor: "pointer" }}
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
              </Link>
              <Typography>exclude</Typography>
            </Stack>
          </Stack>
        ))}
      </Stack>
    )
  },
)
