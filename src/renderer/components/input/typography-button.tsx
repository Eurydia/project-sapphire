import {
  ButtonBase,
  Typography,
  type ButtonBaseProps,
  type TypographyProps,
} from "@mui/material"
import { memo, type FC } from "react"

export const TypographyButton: FC<
  ButtonBaseProps & {
    slotProps?: { typography?: TypographyProps }
  }
> = memo(({ sx, disabled, children, slotProps, ...rest }) => {
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
          ...typoSx,
        }}
      >
        {children}
      </Typography>
    </ButtonBase>
  )
})
