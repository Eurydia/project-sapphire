import {
  Box,
  Breadcrumbs,
  Container,
  Toolbar,
  Typography,
} from "@mui/material";
import { FC, useMemo } from "react";
import Markdown from "react-markdown";
import {
  createSearchParams,
  useLoaderData,
} from "react-router";
import rehypeKatex from "rehype-katex";
import rehypeSanitize from "rehype-sanitize";
import remarkRehype from "remark-rehype";
import { StyledLink } from "../../components/StyledLink";
import { FileLoaderData } from "./file.entity";

export const FileView: FC = () => {
  const { data }: FileLoaderData = useLoaderData();
  const { content, path, vault_name } = data;

  const pathSegments = useMemo(() => {
    return path.split("\\");
  }, [path]);

  return (
    <Container maxWidth="lg">
      <Box sx={{ padding: 4 }}>
        <Toolbar disableGutters>
          <Breadcrumbs>
            <StyledLink to="/">{vault_name}</StyledLink>
            {pathSegments.map((name, index) => {
              const pathSegment = pathSegments
                .slice(0, index + 1)
                .join("\\");
              const params = createSearchParams({
                path: pathSegment,
              });
              const search = `?${params}`;
              return (
                <StyledLink
                  key={"path-segment" + index}
                  to={{ pathname: "/dir", search }}
                >
                  {name}
                </StyledLink>
              );
            })}
          </Breadcrumbs>
        </Toolbar>
        <Typography component="div">
          <Markdown
            remarkPlugins={[remarkRehype]}
            rehypePlugins={[rehypeKatex, rehypeSanitize]}
          >
            {content}
          </Markdown>
        </Typography>
      </Box>
    </Container>
  );
};
