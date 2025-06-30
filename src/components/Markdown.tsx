import { useMarkdownParser } from '@/hooks/useMarkdownParser'
import { Typography } from '@mui/material'
import { type FC, type RefObject } from 'react'

type Props = { content: string }
export const Markdown: FC<Props> = ({ content }) => {
  const containerRef = useMarkdownParser(content)
  return (
    <Typography
      component="div"
      ref={containerRef as RefObject<HTMLDivElement>}
    />
  )
}
