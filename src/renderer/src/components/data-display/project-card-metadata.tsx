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
import type { ProjectWithMetadata } from "~/db/models/project/project-table-entity"
import { useLoggerStore } from "~/stores/useLoggerStore"

type InnerProps = {
  fetcher: ProjectWithMetadata["metadata"]
  uuid: ProjectWithMetadata["uuid"]
}
const Inner: FC<InnerProps> = memo(({ fetcher, uuid }) => {
  const { logNotice, logWarn } = useLoggerStore()
  const result = use(fetcher)

  useEffect(() => {
    if (isLeft(result)) {
      logWarn(
        `failed to resolve metadata promise for ${uuid}: ${String(result.left)}`,
      )
    } else {
      logNotice(`resolved metadata promise for ${uuid}`)
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
  project: ProjectWithMetadata
}
export const ProjectCardMetadata: FC<Props> = memo(
  ({ project: { metadata, uuid } }) => {
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
          <Inner fetcher={metadata} uuid={uuid} />
        </Suspense>
      </Stack>
    )
  },
)
