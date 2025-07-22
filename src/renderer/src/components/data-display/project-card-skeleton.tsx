import {
  EditOutlined,
  FolderOpenOutlined,
  PushPinOutlined,
} from "@mui/icons-material"
import {
  Divider,
  Paper,
  Skeleton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import type { FC } from "react"
import { memo } from "react"

export const ProjectCardSkeleton: FC = memo(() => {
  const { breakpoints } = useTheme()
  const isSmallScreen = useMediaQuery(breakpoints.down("md"))
  return (
    <Paper variant="outlined">
      <Stack
        direction={{ xs: "column-reverse", md: "row" }}
        spacing={2}
        divider={
          <Divider
            flexItem
            orientation={
              isSmallScreen ? "horizontal" : "vertical"
            }
          />
        }
      >
        <Stack
          spacing={3}
          flexBasis={0}
          flexGrow={1}
          component="div"
        >
          <Stack>
            <Typography
              variant="subtitle2"
              color="textSecondary"
            >
              <Skeleton />
            </Typography>
            <Typography
              variant="subtitle2"
              color="textSecondary"
            >
              <Skeleton />
            </Typography>
          </Stack>
          <Stack>
            <Typography variant="h4">
              <Skeleton />
            </Typography>
            <Typography>
              <Skeleton />
            </Typography>
          </Stack>
        </Stack>
        <Stack
          spacing={2}
          flexBasis={0}
          flexGrow={0}
          direction={{ xs: "row", md: "column" }}
        >
          <PushPinOutlined />
          <EditOutlined />
          <FolderOpenOutlined />
        </Stack>
      </Stack>
    </Paper>
  )
})
