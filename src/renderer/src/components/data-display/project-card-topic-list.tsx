import {
  Chip,
  darken,
  Skeleton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material"
import { useNavigate } from "@tanstack/react-router"
import type { FC } from "react"
import {
  Fragment,
  memo,
  Suspense,
  use,
  useCallback,
  useMemo,
} from "react"
import type { TopicTableEntity } from "~/db/models/topic/topic-table.entity"
import { listTopicManyByUuids } from "~/db/topics"

type InnerProps = {
  fetcher: Promise<TopicTableEntity[]>
}
const Inner: FC<InnerProps> = memo(({ fetcher }) => {
  const { palette } = useTheme()
  const navigate = useNavigate()
  const items = use(fetcher)

  const onClickHandleProvider = useCallback(
    (uuid: string) => () => {
      navigate({ to: "/topics", hash: uuid })
    },
    [navigate],
  )
  if (items.length === 0) {
    return (
      <Typography
        variant="subtitle2"
        color="textSecondary"
      >{`not set`}</Typography>
    )
  }
  return (
    <Fragment>
      {items.map(({ uuid, name, color }, index) => (
        <Chip
          key={`tag-item[${index}]`}
          sx={{
            cursor: "pointer",
            backgroundColor: color,
            color: palette.getContrastText(color),
            "&:hover": {
              backgroundColor: darken(color, 0.01),
              color: palette.getContrastText(
                darken(color, 0.05),
              ),
            },
          }}
          component="div"
          onClick={onClickHandleProvider(uuid)}
          label={name}
        />
      ))}
    </Fragment>
  )
})

type Props = {
  topicUuids: string[]
}
export const ProjectCardTopicList: FC<Props> = memo(
  ({ topicUuids }) => {
    const fetcher = useMemo(() => {
      return listTopicManyByUuids(topicUuids)
    }, [topicUuids])

    return (
      <Stack
        spacing={0.5}
        useFlexGap
        flexWrap="wrap"
        direction="row"
        alignItems="center"
      >
        <Typography variant="subtitle2" color="textSecondary">
          {`topics(s):`}
        </Typography>
        <Suspense
          fallback={
            <Fragment>
              <Skeleton
                variant="circular"
                width={20}
                height={20}
              />
              <Skeleton
                variant="circular"
                width={20}
                height={20}
              />
              <Skeleton
                variant="circular"
                width={20}
                height={20}
              />
            </Fragment>
          }
        >
          <Inner fetcher={fetcher} />
        </Suspense>
      </Stack>
    )
  },
)
