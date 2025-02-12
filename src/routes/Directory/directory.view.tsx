import { FolderRounded } from "@mui/icons-material";
import {
  Box,
  Breadcrumbs,
  Container,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import { FC, useMemo } from "react";
import {
  createSearchParams,
  Link,
  useLoaderData,
} from "react-router";
import { StyledLink } from "../../components/StyledLink";
import { DirectoryLoaderData } from "./directory.entity";

export const RepositoryView: FC = () => {
  const { data }: DirectoryLoaderData = useLoaderData();
  const { directories, files, path, vault_name } = data;

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
        <List>
          {directories.map((item, index) => {
            const params = createSearchParams({
              path: item.path,
            });
            const search = `?${params}`;
            return (
              <ListItem
                key={"item" + index}
                disablePadding
                divider
              >
                <ListItemButton
                  disableRipple
                  disableTouchRipple
                  component={Link}
                  to={{
                    pathname: `/dir`,
                    search,
                  }}
                >
                  <ListItemIcon>
                    <FolderRounded />
                  </ListItemIcon>
                  <ListItemText disableTypography>
                    <Typography fontFamily="monospace">
                      {item.name}
                    </Typography>
                  </ListItemText>
                </ListItemButton>
              </ListItem>
            );
          })}
          {files.map((item, index) => {
            const params = createSearchParams({
              path: item.path,
            });
            const search = `?${params}`;
            return (
              <ListItem
                key={"item" + index}
                disablePadding
                divider
              >
                <ListItemButton
                  disableRipple
                  disableTouchRipple
                  component={Link}
                  to={{
                    pathname: `/file`,
                    search,
                  }}
                >
                  <ListItemIcon></ListItemIcon>
                  <ListItemText disableTypography>
                    <Typography fontFamily="monospace">
                      {item.name}
                    </Typography>
                  </ListItemText>
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Container>
  );
};
