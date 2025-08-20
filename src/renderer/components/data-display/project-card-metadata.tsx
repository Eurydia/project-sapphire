import { Stack, Typography } from "@mui/material"
import moment from "moment"
import { memo, useMemo, type FC } from "react"
import type { Project } from "src/shared/models/project/project"

type Props = {
  project: Project
}
export const ProjectCardMetadata: FC<Props> = memo(
  ({ project }) => {
    const items: {
      label: string
      value?: { fromNow: string; exact: string }
    }[] = useMemo(() => {
      return [
        {
          label: "project opened",
          value:
            project.lastVisited === null
              ? undefined
              : {
                  exact: project.lastVisited,
                  fromNow: moment(project.lastVisited).fromNow(),
                },
        },
        {
          label: "project added",
          value: {
            exact: project.created,
            fromNow: moment(project.created).fromNow(),
          },
        },
        // {
        //   label: "root accessed",
        //   value: project.root.metadata?.atime ?? undefined,
        // },
        // {
        //   label: "root modified",
        //   value: project.root.metadata?.mtime ?? undefined,
        // },
        // {
        //   label: "root created",
        //   value: project.root.metadata?.ctime ?? undefined,
        // },
      ]
    }, [project])

    return (
      <Stack>
        {items.map(({ label, value }) => (
          <Stack
            key={`item-${label}`}
            rowGap={0}
            columnGap={1}
            flexDirection="row"
            useFlexGap
            flexWrap="wrap"
          >
            <Typography
              variant="subtitle2"
              color="textSecondary"
            >
              {`${label}:`}
            </Typography>
            {value === undefined && (
              <Typography variant="subtitle2" color="warning">
                {`unavailable`}
              </Typography>
            )}
            {value !== undefined && (
              <Typography
                color="textSecondary"
                variant="subtitle2"
              >
                {`${value.fromNow} @ ${value.exact}`}
              </Typography>
            )}
          </Stack>
        ))}
      </Stack>
    )
  },
)
