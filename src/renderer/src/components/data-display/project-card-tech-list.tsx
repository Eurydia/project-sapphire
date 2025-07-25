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
import type { Technology } from "~/db/models/technology/tech-table-entity"

type InnerProps = {
  fetcher: Technology[]
}
const Inner: FC<InnerProps> = memo(({ fetcher: items }) => {
  const { palette } = useTheme()
  const navigate = useNavigate()

  const onClickHandleProvider = useCallback(
    (uuid: string) => () => {
      navigate({ to: "/technologies", hash: uuid })
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
              backgroundColor: darken(color, 0.5),
              color: palette.getContrastText(darken(color, 0.5)),
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
  items: Technology[]
}
export const ProjectCardTechList: FC<Props> = memo(
  ({ items }) => {
    return (
      <Stack
        spacing={0.5}
        useFlexGap
        flexWrap="wrap"
        direction="row"
        alignItems="center"
      >
        <Typography variant="subtitle2" color="textSecondary">
          {`tech(s):`}
        </Typography>
        <Inner fetcher={items} />
      </Stack>
    )
  },
)
