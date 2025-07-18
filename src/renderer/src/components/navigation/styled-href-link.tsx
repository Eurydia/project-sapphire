import { Link, useTheme } from '@mui/material'
import { memo } from 'react'
import type { LinkProps } from '@mui/material'
import type { FC } from 'react'

export const StyledHrefLink: FC<LinkProps> = memo(({ sx, ...rest }) => {
  const {
    palette: { link },
  } = useTheme()
  return (
    <Link
      {...rest}
      sx={{
        ...sx,
        color: link.normal,
        textDecorationColor: link.normal,
        '&:visited': {
          color: link.visited,
          textDecorationColor: link.visited,
        },
      }}
    />
  )
})
