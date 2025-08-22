import {
  alpha,
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
> = memo(({ sx, disabled, children, slotProps, ...rest }) => {
  const {
    palette: { link },
  } = useTheme()
  const { sx: typoSx, ...typoRest } = slotProps?.typography ?? {
    sx: {},
  }
  return (
    <ButtonBase
      {...rest}
      disabled={disabled}
      disableRipple
      disableTouchRipple
      tabIndex={0}
      sx={{
        ...sx,
        width: "fit-content",
      }}
    >
      <Typography
        {...typoRest}
        tabIndex={0}
        component="span"
        sx={{
          textDecorationLine: disabled
            ? "line-through"
            : undefined,
          userSelect: "none",
          color: disabled
            ? alpha(link.normal, 0.5)
            : link.normal,
          "&:hover": {
            color: link.hover,
          },
          ...typoSx,
        }}
      >
        {children}
      </Typography>
    </ButtonBase>
  )
})
