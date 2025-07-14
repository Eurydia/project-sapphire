import { Chip, Stack, darken, useTheme } from '@mui/material'
import { memo, useCallback } from 'react'
import { useNavigate } from '@tanstack/react-router'
import type { Topic } from 'models/topics/topic'
import type { FC } from 'react'

type Props = {
  items: Array<Topic>
}
export const TopicTagList: FC<Props> = memo(({ items }) => {
  const {
    palette,
    typography: { monospaceFontFamily },
  } = useTheme()
  const navigate = useNavigate()
  const onClickHandleProvider = useCallback(
    (uuid: string) => () => {
      navigate({ to: '/topics', hash: uuid })
    },
    [navigate],
  )
  if (items.length === 0) {
    return null
  }
  return (
    <Stack spacing={1} direction="row">
      {items.map(({ uuid, name, color }, index) => (
        <Chip
          key={`tag-item[${index}]`}
          sx={{
            cursor: 'pointer',
            backgroundColor: color,
            color: palette.getContrastText(color),
            '&:hover': {
              backgroundColor: darken(color, 0.5),
              color: palette.getContrastText(darken(color, 0.5)),
            },
            fontFamily: monospaceFontFamily,
          }}
          component="div"
          onClick={onClickHandleProvider(uuid)}
          label={name}
        />
      ))}
    </Stack>
  )
})
