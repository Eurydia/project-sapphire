import {
  Divider,
  lighten,
  Typography,
} from "@mui/material";
import { FC } from "react";
import Markdown, { Components } from "react-markdown";
import rehypeDocument from "rehype-document";
import rehypeMathjax from "rehype-mathjax";
import rehypeSanitize from "rehype-sanitize";
import remarkMath from "remark-math";
import remarkParse, {
  Options as RemarkParseOptions,
} from "remark-parse";
import remarkRehype from "remark-rehype";

const COMPONENTS: Partial<Components> = {
  p: ({ children, className }) => (
    <Typography
      className={className}
      fontFamily="ibm plex serif"
    >
      {children}
    </Typography>
  ),
  pre: ({ children, className }) => (
    <Typography
      className={className}
      component="pre"
      sx={{
        overflowX: "auto",
        padding: 2,
        borderStyle: "solid",
        borderWidth: 4,
        borderColor: ({ palette }) =>
          lighten(palette.background.default, 0.1),
        marginY: 2,
        scrollbarWidth: "thin",
      }}
    >
      {children}
    </Typography>
  ),
  span: ({ children, className }) => (
    <Typography
      className={className}
      fontFamily="ibm plex serif"
    >
      {children}
    </Typography>
  ),
  hr: ({ className }) => (
    <Divider
      flexItem
      className={className}
    />
  ),
};

type StyledMarkdownProps = { children: string };
export const StyledMarkdown: FC<StyledMarkdownProps> = (
  props
) => {
  const { children } = props;
  return (
    <Typography
      sx={{
        fontFamily: "ibm plex serif",
      }}
    >
      <Markdown
        components={COMPONENTS}
        remarkPlugins={[
          remarkMath,
          remarkRehype,
          [
            remarkParse,
            { fragment: true } as RemarkParseOptions,
          ],
        ]}
        rehypePlugins={[
          rehypeSanitize,
          rehypeDocument,
          rehypeMathjax,
        ]}
      >
        {children}
      </Markdown>
    </Typography>
  );
};
