import {
  Typography,
  useTheme,
  type ButtonBaseProps,
} from "@mui/material"
import { memo, type FC } from "react"

export const TypographyButton: FC<ButtonBaseProps> = memo(
  (props) => {
    const {
      palette: { link },
    } = useTheme()
    return (
      <Typography
        component="button"
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
