import type { LinkProps } from "@mui/material"
import { Link } from "@mui/material"
import type { FC } from "react"
import { memo } from "react"

export const StyledHrefLink: FC<LinkProps> = memo(
  ({ sx, ...rest }) => {
    return <Link {...rest} sx={sx} />
  },
)
