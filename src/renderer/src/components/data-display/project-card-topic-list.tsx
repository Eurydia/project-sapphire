import {
  Chip,
  darken,
  Stack,
  Typography,
  useTheme,
} from "@mui/material"
import { useNavigate } from "@tanstack/react-router"
import type { FC } from "react"
import { Fragment, memo, useCallback } from "react"
import type { TopicTableEntity } from "~/db/models/topic/topic-table.entity"

type InnerProps = {
  fetcher: TopicTableEntity[]
}
const Inner: FC<InnerProps> = memo(({ fetcher: items }) => {
  const { palette } = useTheme()
  const navigate = useNavigate()

  const onClickHandleProvider = useCallback(
    (uuid: string) => () => {
      navigate({ to: "/topics", hash: uuid })
    },
    [navigate],
  )
  if (items.length === 0) {
    return (
      <Typography variant="subtitle2" color="textSecondary">
        {`not set`}
      </Typography>
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
  items: TopicTableEntity[]
}
export const ProjectCardTopicList: FC<Props> = memo(
  ({ items }) => {
    return (
      <Stack
        rowGap={0.5}
        columnGap={0}
        useFlexGap
        flexWrap="wrap"
        direction="row"
        alignItems="center"
      >
        <Typography variant="subtitle2" color="textSecondary">
          {`topics(s):`}
        </Typography>
        <Inner fetcher={items} />
      </Stack>
    )
  },
)
