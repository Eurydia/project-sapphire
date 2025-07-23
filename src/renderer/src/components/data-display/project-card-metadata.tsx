import { Skeleton, Stack, Typography } from "@mui/material"
import { isLeft } from "fp-ts/lib/Either"
import {
  Fragment,
  memo,
  Suspense,
  use,
  useEffect,
  useMemo,
  type FC,
} from "react"
import type {
  Project,
  ProjectWithMetadata,
} from "~/db/models/project/project"
import { getProjectRootMetadata } from "~/db/projects"
import { useLoggerStore } from "~/stores/useLoggerStore"

type InnerProps = {
  fetcher: ProjectWithMetadata["metadata"]
}
const Inner: FC<InnerProps> = memo(({ fetcher }) => {
  const { logNotice, logWarn } = useLoggerStore()
  const result = use(fetcher)

  useEffect(() => {
    if (isLeft(result)) {
      logWarn(
        `failed to fetch project root metadata: ${String(result.left)}`,
      )
    } else {
      logNotice(`fetched project root metadata ok`)
    }
  }, [result, logNotice, logWarn])

  const items: {
    label: string
    value?: { fromNow: string; exact: string }
  }[] = useMemo(() => {
    if (isLeft(result)) {
      return [
        { label: "created" },
        { label: "accessed" },
        { label: "modified" },
      ]
    }
    const { ctime, atime, mtime } = result.right
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
  }, [result])

  return (
    <Fragment>
      {items.map(({ label, value }, index) => (
        <Stack
          key={`item-${index}`}
          spacing={1}
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
  project: Project & {
    metadata: ReturnType<typeof getProjectRootMetadata>
  }
}
export const ProjectCardMetadata: FC<Props> = memo(
  ({ project: { metadata } }) => {
    return (
      <Stack>
        <Suspense
          fallback={
            <Fragment>
              {["created", "accessed", "modified"].map(
                (label, index) => (
                  <Stack
                    key={`item-${index}`}
                    spacing={1}
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
                    <Typography
                      color="textSecondary"
                      variant="subtitle2"
                    >
                      <Skeleton />
                    </Typography>
                  </Stack>
                ),
              )}
            </Fragment>
          }
        >
          <Inner fetcher={metadata} />
        </Suspense>
      </Stack>
    )
  },
)
