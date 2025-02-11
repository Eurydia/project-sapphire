import { BorderColorRounded } from "@mui/icons-material";
import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  Container,
  Toolbar,
  Typography,
} from "@mui/material";
import { invoke } from "@tauri-apps/api/core";
import { FC, useMemo } from "react";
import {
  createSearchParams,
  useLoaderData,
} from "react-router";
import { StyledLink } from "../../components/StyledLink";
import { StyledMarkdown } from "../../components/StyledMarkdown";
import { FileLoaderData } from "./file.entity";

export const FileView: FC = () => {
  const { data }: FileLoaderData = useLoaderData();
  const { content, path, name, vault_name } = data;

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
        <Toolbar disableGutters>
          <Button
            startIcon={<BorderColorRounded />}
            variant="outlined"
            disableElevation
            disableRipple
            disableFocusRipple
            disableTouchRipple
            onClick={() => {
              invoke("open_directory", {
                path,
              });
            }}
          >
            Edit
          </Button>
        </Toolbar>
        <Typography component="div">
          {content.length === 0 && (
            <Alert
              severity="info"
              variant="outlined"
            >
              This file is empty.
            </Alert>
          )}
          <StyledMarkdown>{content}</StyledMarkdown>
        </Typography>
      </Box>
    </Container>
  );
};
