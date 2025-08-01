import { GlobalStyles, lighten } from "@mui/material"

export const globalStyle = (
  <GlobalStyles
    styles={(theme) => ({
      body: {
        scrollbarColor: `${lighten(theme.palette.background.paper, 0.2)} transparent`,
      } as CSSStyleDeclaration,
    })}
  />
)
