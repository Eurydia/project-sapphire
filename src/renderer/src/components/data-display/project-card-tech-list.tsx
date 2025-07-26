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
import type { Technology } from "~/db/models/technology/tech-table-entity"
import { listTechManyByUuids } from "~/db/technologies"

type InnerProps = {
  fetcher: Promise<Technology[]>
}
const Inner: FC<InnerProps> = memo(({ fetcher }) => {
  const { palette } = useTheme()
  const navigate = useNavigate()
  const items = use(fetcher)

  const onClickHandleProvider = useCallback(
    (uuid: string) => () => {
      navigate({ to: "/technologies", hash: uuid })
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
  techUuids: string[]
}
export const ProjectCardTechList: FC<Props> = memo(
  ({ techUuids }) => {
    const fetcher = useMemo(() => {
      return listTechManyByUuids(techUuids)
    }, [techUuids])

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
