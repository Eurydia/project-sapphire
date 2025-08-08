import type { LinkProps } from "@mui/material"
import { Link, useTheme } from "@mui/material"
import type { LinkComponent } from "@tanstack/react-router"
import { createLink } from "@tanstack/react-router"
import React from "react"

const MUILinkComponent = React.forwardRef<
  HTMLAnchorElement,
  LinkProps
>(({ sx, ...props }, ref) => {
  const {
    palette: {
      link: { hover, normal, visited },
    },
  } = useTheme()
  return (
    <Link
      ref={ref}
      {...props}
      sx={{
        color: normal,
        textDecorationColor: normal,
        textDecorationLine: "none",
        "&:visited": {
          textDecorationColor: visited,
          color: visited,
        },
        "&:hover": {
          textDecorationColor: hover,
          color: hover,
        },
        ...sx,
      }}
    />
  )
})

const CreatedLinkComponent = createLink(MUILinkComponent)

export const StyledLink: LinkComponent<
  typeof MUILinkComponent
> = (props) => {
  return <CreatedLinkComponent preload="intent" {...props} />
}
