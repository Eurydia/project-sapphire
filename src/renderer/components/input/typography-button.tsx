import {
  Typography,
  useTheme,
  type TypographyProps,
} from "@mui/material"
import { memo, type FC } from "react"

export const TypographyButton: FC<TypographyProps> = memo(
  ({ sx, ...rest }) => {
    const {
      palette: { link },
    } = useTheme()
    return (
      <Typography
        tabIndex={0}
        {...rest}
        sx={{
          textAlign: "center",
          userSelect: "none",
          cursor: "pointer",
          color: link.normal,
          "&:hover": {
            color: link.hover,
          },
          ...sx,
        }}
      />
    )
  },
)
