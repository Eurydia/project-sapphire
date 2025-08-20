import {
  ButtonBase,
  Typography,
  useTheme,
  type ButtonBaseProps,
  type TypographyProps,
} from "@mui/material"
import { memo, type FC } from "react"

export const TypographyButton: FC<
  ButtonBaseProps & {
    slotProps?: { typography?: TypographyProps }
  }
> = memo(
  ({
    sx,
    children,
    slotProps: { typography } = { typography: {} },
    ...rest
  }) => {
    const {
      palette: { link },
    } = useTheme()
    return (
      <ButtonBase
        {...rest}
        disableRipple
        disableTouchRipple
        tabIndex={-1}
        sx={{ ...sx, width: "fit-content" }}
      >
        <Typography
          {...typography}
          tabIndex={0}
          sx={{
            ...typography?.sx,
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
