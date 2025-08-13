import {
  ButtonBase,
  Typography,
  useTheme,
  type ButtonBaseProps,
} from "@mui/material"
import { memo, type FC } from "react"

export const TypographyButton: FC<ButtonBaseProps> = memo(
  ({ sx, children, ...rest }) => {
    const {
      palette: { link },
    } = useTheme()
    return (
      <ButtonBase
        {...rest}
        disableRipple
        disableTouchRipple
        sx={sx}
      >
        <Typography
          tabIndex={0}
          sx={{
            userSelect: "none",
            color: link.normal,
            "&:hover": {
              color: link.hover,
            },
          }}
        >
          {children}
        </Typography>
      </ButtonBase>
    )
  },
)
