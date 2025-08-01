import {
  LogLevel,
  useLoggerStore,
} from "@/stores/useLoggerStore"
import {
  VisibilityOffRounded,
  VisibilityRounded,
} from "@mui/icons-material"
import {
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  lighten,
  Stack,
  styled,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material"
import {
  memo,
  useMemo,
  useRef,
  useState,
  type FC,
  type ReactNode,
} from "react"
import {
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from "react-resizable-panels"

const StyledHandle = styled(PanelResizeHandle)(
  ({
    theme: {
      palette: {
        divider,
        background: { paper },
      },
    },
  }) => ({
    backgroundColor: divider,
    width: "auto",
    height: 5,
    "&[data-resize-handle-state=drag]": {
      backgroundColor: lighten(paper, 0.4),
    },
  }),
)

type Props = { children: ReactNode }
export const LogInspector: FC<Props> = memo(({ children }) => {
  const ref = useRef<HTMLDivElement>(null)
  const logs = useLoggerStore((state) => state.logs)
  const {
    palette: { divider, text },
  } = useTheme()
  const colormap: { [k in keyof typeof LogLevel]: string } =
    useMemo(() => {
      return {
        error: "#E53935",
        warn: "#FB8C00",
        info: "#43A047",
        notice: "#00ACC1",
        trace: "#1E88E5",
      }
    }, [])

  const [levels, setLevels] = useState({
    error: true,
    warn: true,
    info: true,
    notice: true,
  })

  useLoggerStore.subscribe(
    (state) => state.logs,
    () => {
      if (ref.current === null) {
        return
      }
      ref.current.scrollTo({ top: ref.current.scrollHeight })
    },
  )

  const logItems = useMemo(() => {
    return logs.filter((log) => levels[log.level])
  }, [logs, levels])

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100%",
      }}
    >
      <PanelGroup direction="vertical">
        <Panel defaultSize={30}>
          <Box
            sx={{
              height: "100%",
              overflow: "auto",
              scrollbarColor: "transparent transparent",
              "&:hover": {
                scrollbarColor: `${divider} transparent`,
              },
            }}
          >
            {children}
          </Box>
        </Panel>
        <StyledHandle />
        <Panel defaultSize={15} maxSize={80} minSize={15}>
          <Box
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Toolbar variant="dense">
              {Object.entries(levels).map(([key, value]) => (
                <FormControlLabel
                  key={`level-selector-${key}`}
                  control={
                    <Checkbox
                      disableTouchRipple
                      icon={<VisibilityOffRounded />}
                      checkedIcon={
                        <VisibilityRounded
                          htmlColor={text.primary}
                        />
                      }
                      checked={value}
                      onChange={(_, value) =>
                        setLevels((prev) => {
                          const next = { ...prev }
                          next[key] = value
                          return next
                        })
                      }
                    />
                  }
                  slotProps={{
                    typography: {
                      sx: {
                        textDecorationLine: value
                          ? undefined
                          : "line-through",
                      },
                    },
                  }}
                  label={key}
                />
              ))}
            </Toolbar>
            <Divider flexItem />
            <Box
              component="div"
              ref={ref}
              sx={{
                overflow: "auto",
                flexBasis: 0,
                flexGrow: 1,
                padding: 2,
                scrollbarColor: "transparent transparent",
                "&:hover": {
                  scrollbarColor: `${divider} transparent`,
                },
              }}
            >
              <Stack>
                {logItems.map(
                  ({ datetime, level, msg }, index) => {
                    return (
                      <Stack key={`${datetime}-${index}`}>
                        <Stack spacing={1} flexDirection="row">
                          <Typography
                            color="textSecondary"
                            whiteSpace="nowrap"
                          >
                            {`${datetime}`}
                          </Typography>
                          <Typography
                            fontWeight="900"
                            color={colormap[level]}
                            whiteSpace="nowrap"
                          >
                            {`[${level}]`}
                          </Typography>
                          <Typography>{`${msg}`}</Typography>
                        </Stack>
                      </Stack>
                    )
                  },
                )}
              </Stack>
            </Box>
          </Box>
        </Panel>
      </PanelGroup>
    </Box>
  )
})
