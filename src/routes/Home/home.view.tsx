import { FolderRounded } from "@mui/icons-material";
import {
  Box,
  Breadcrumbs,
  Button,
  Container,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { invoke } from "@tauri-apps/api/core";
import { FC, Fragment } from "react";
import {
  createSearchParams,
  Link,
  useLoaderData,
} from "react-router";
import { StyledLink } from "../../components/StyledLink";
import { HomeLoaderData } from "./home.entity";

export const HomeView: FC = () => {
  const { data }: HomeLoaderData = useLoaderData();
  const { name, repositories, config } = data;

  return (
    <Container maxWidth="lg">
      <Box sx={{ padding: 4 }}>
        <Breadcrumbs>
          <StyledLink to="/">{name}</StyledLink>s
        </Breadcrumbs>
        <Toolbar disableGutters>
          <Button
            disableElevation
            disableFocusRipple
            disableTouchRipple
            disableRipple
            startIcon={<FolderRounded />}
            onClick={() =>
              invoke("open_directory", { path: "" })
            }
          >
            OPEN
          </Button>
        </Toolbar>
        <Stack spacing={4}>
          <Typography
            variant="h2"
            fontWeight={900}
          >
            Collections
          </Typography>
          {Object.entries(config.collections)
            .toSorted(([a], [b]) => a.localeCompare(b))
            .map(([name, repos], index) => {
              return (
                <Fragment key={"collection" + index}>
                  <Typography
                    variant="h3"
                    fontWeight={900}
                  >
                    {name}
                  </Typography>
                  <List disablePadding>
                    {repos.map((repo, reIndex) => {
                      const params = createSearchParams({
                        path: repo,
                      });
                      const search = `?${params}`;
                      return (
                        <ListItem
                          key={
                            "collection" +
                            index +
                            "repo" +
                            reIndex
                          }
                          disablePadding
                          divider
                        >
                          <ListItemButton
                            disableRipple
                            disableTouchRipple
                            component={Link}
                            to={{
                              pathname: "/dir",
                              search,
                            }}
                          >
                            <ListItemIcon>
                              <FolderRounded />
                            </ListItemIcon>
                            <ListItemText
                              slotProps={{
                                primary: {
                                  fontFamily: "monospace",
                                },
                              }}
                            >
                              {`${repo}/`}
                            </ListItemText>
                          </ListItemButton>
                        </ListItem>
                      );
                    })}
                  </List>
                </Fragment>
              );
            })}
          <Typography
            variant="h2"
            fontWeight={900}
          >
            All repositories
          </Typography>
          <List disablePadding>
            {repositories.map((path) => {
              const params = createSearchParams({
                path: path,
              });
              const search = `?${params}`;
              return (
                <ListItem
                  key={path}
                  divider
                  disablePadding
                >
                  <ListItemButton
                    component={Link}
                    to={{ pathname: "/dir", search }}
                    disableRipple
                    disableTouchRipple
                  >
                    <ListItemIcon>
                      <FolderRounded />
                    </ListItemIcon>
                    <ListItemText
                      slotProps={{
                        primary: {
                          fontFamily: "monospace",
                        },
                      }}
                    >{`${path}/`}</ListItemText>
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Stack>
      </Box>
    </Container>
  );
};
