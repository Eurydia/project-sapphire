import type { LinkProps } from "@mui/material"
import { Link } from "@mui/material"
import type { LinkComponent } from "@tanstack/react-router"
import { createLink } from "@tanstack/react-router"
import React from "react"

const MUILinkComponent = React.forwardRef<
  HTMLAnchorElement,
  LinkProps
>(({ sx, ...props }, ref) => {
  return (
    <Link
      ref={ref}
      {...props}
      sx={{
        textDecorationLine: "none",
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
