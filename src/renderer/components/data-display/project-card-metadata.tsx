import { Stack, Typography } from "@mui/material"
import { Fragment, memo, useMemo, type FC } from "react"
import type { Project } from "src/shared/models/project/project"

type InnerProps = {
  fetcher: Project
}
const Inner: FC<InnerProps> = memo(({ fetcher: project }) => {
  const items: {
    label: string
    value?: { fromNow: string; exact: string }
  }[] = useMemo(() => {
    if (project.root.metadata === null) {
      return [
        { label: "created" },
        { label: "accessed" },
        { label: "modified" },
      ]
    }
    const { ctime, atime, mtime } = project.root.metadata
    return [
      {
        label: "created",
        value: ctime,
      },
      {
        label: "accessed",
        value: atime,
      },
      {
        label: "modified",
        value: mtime,
      },
    ]
  }, [project.root.metadata])

  return (
    <Fragment>
      {items.map(({ label, value }, index) => (
        <Stack
          key={`item-${index}`}
          rowGap={0}
          columnGap={1}
          flexDirection="row"
          useFlexGap
          flexWrap="wrap"
        >
          <Typography variant="subtitle2" color="textSecondary">
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
    </Fragment>
  )
})

type Props = {
  project: Project
}
export const ProjectCardMetadata: FC<Props> = memo(
  ({ project }) => {
    return (
      <Stack>
        <Inner fetcher={project} />
      </Stack>
    )
  },
)
