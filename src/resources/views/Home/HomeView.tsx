import {
  FolderRounded,
  LaunchRounded,
} from "@mui/icons-material";
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";
import { invoke } from "@tauri-apps/api/core";
import { FC } from "react";
import {
  createSearchParams,
  Link,
  useLoaderData,
} from "react-router";
import { StyledLink } from "~components/StyledLink";
import { HomeLoaderData } from "~types/home.types";

export const HomeView: FC = () => {
  const { data }: HomeLoaderData = useLoaderData();

  const { name, repositories } = data;

  return (
    <Container maxWidth="lg">
      <Box sx={{ padding: 4 }}>
        <Breadcrumbs>
          <StyledLink to="/">{name}</StyledLink>
        </Breadcrumbs>
        <Toolbar disableGutters>
          <Button
            disableElevation
            disableFocusRipple
            disableTouchRipple
            disableRipple
            startIcon={<LaunchRounded />}
            variant="outlined"
            onClick={() =>
              invoke("open_directory", { path: "" })
            }
          >
            OPEN
          </Button>
        </Toolbar>
        <Card variant="outlined">
          <CardHeader
            title="All repositories"
            slotProps={{
              title: {
                fontWeight: 900,
              },
            }}
          />
          <CardContent>
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
                      >
                        {path}
                      </ListItemText>
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};
