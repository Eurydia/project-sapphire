import { Box, Stack, Typography } from "@mui/material"
import { memo, type FC } from "react"
import { useLoggerStore } from "~/stores/useLoggerStore"

export const LogInspector: FC = memo(() => {
  const logs = useLoggerStore((state) => state.logs)
  return (
    <Box
      sx={{
        overflow: "auto",
        top: "auto",
        bottom: 0,
        position: "fixed",
        width: "100%",
        padding: 2,
        height: "200px",
        borderWidth: "1px 0px 0px 0px",
        borderStyle: "solid",
        borderColor: "divider",
      }}
    >
      <Stack>
        {logs.map(({ datetime, level, msg }, index) => (
          <Stack key={`${datetime}-${index}`}>
            <Typography>{`[${level}] ${datetime}: ${msg}`}</Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  )
})
