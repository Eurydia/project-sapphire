import { useEffect, useRef } from 'react'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeHighlight from 'rehype-highlight'
import rehypeMathJax from 'rehype-mathjax'
import rehypeRaw from 'rehype-raw'
import rehypeSlug from 'rehype-slug'
import rehypeStringify from 'rehype-stringify'
import { remark } from 'remark'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import remarkRehype from 'remark-rehype'

const processor = remark()
  .use(remarkGfm)
  .use(remarkFrontmatter)
  .use(remarkMath)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw)
  .use(rehypeSlug)
  .use(rehypeAutolinkHeadings, { behavior: 'wrap' })
  .use(rehypeMathJax)
  .use(rehypeHighlight)
  .use(rehypeStringify)
export const useMarkdownParser = (markdown: string) => {
  const containerRef = useRef<HTMLElement>(null)
  useEffect(() => {
    if (!containerRef.current) {
      return
    }
    let cancelled = false

    const process = async () => {
      const file = await processor.process(markdown)
      if (!cancelled && containerRef.current) {
        containerRef.current.innerHTML = String(file)
      }
    }

    process()

    return () => {
      cancelled = true
    }
  }, [containerRef, markdown])
  return containerRef
}
