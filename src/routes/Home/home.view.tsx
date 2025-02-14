import { FolderRounded } from "@mui/icons-material";
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Container,
  Grid2,
  Toolbar,
  Typography,
} from "@mui/material";
import { invoke } from "@tauri-apps/api/core";
import { FC, useState } from "react";
import {
  createSearchParams,
  Link,
  useLoaderData,
  useNavigate,
} from "react-router";
import { StyledLink } from "../../components/StyledLink";
import { HomeLoaderData } from "./home.entity";

export const HomeView: FC = () => {
  const { data, repositoryLookup }: HomeLoaderData =
    useLoaderData();
  const { name, repositories, config } = data;
  const [items, setItems] = useState<string[]>([]);
  const [collName, setCollName] = useState("");
  const navigate = useNavigate();
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
            startIcon={<FolderRounded />}
            onClick={() =>
              invoke("open_directory", { path: "" })
            }
          >
            OPEN
          </Button>
        </Toolbar>
        {/* {Object.entries(config.collections)
          .toSorted(([a], [b]) => a.localeCompare(b))
          .map(([name, repos], index) => (
            <List
              key={"collection" + index}
              subheader={name}
            >
              {repos.map((repo, reIndex) => {
                const repoData = repositoryLookup.get(repo);
                if (repoData === undefined) {
                  return null;
                }
                const params = createSearchParams({
                  path: repoData.path,
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
                  >
                    <ListItemButton
                      component={Link}
                      to={{ pathname: "/dir", search }}
                    >
                      <ListItemText>
                        {repoData.name}
                      </ListItemText>
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          ))}
        <Toolbar>
          <Button
            onClick={async () => {
              if (
                await createVaultCollection(collName, items)
              ) {
                setItems([]);
                setCollName("");
                navigate(0);
              }
            }}
          >
            add collection
          </Button>
        </Toolbar>
        <TextField
          value={collName}
          onChange={(e) => setCollName(e.target.value)}
        />
        <List>
          {repositories.map((item, index) => (
            <ListItem key={"list-item" + index}>
              <ListItemButton
                onClick={() => {
                  if (items.includes(item.path)) {
                    setItems((prev) =>
                      prev.filter(
                        (value) =>
                          value.localeCompare(item.path) !==
                          0
                      )
                    );
                  } else {
                    setItems((prev) => {
                      const next = [...prev];
                      next.push(item.path);
                      return next;
                    });
                  }
                }}
              >
                <ListItemIcon>
                  {items.includes(item.path) ? (
                    <CheckBoxRounded />
                  ) : (
                    <CheckBoxOutlineBlankRounded />
                  )}
                </ListItemIcon>
                <ListItemText>{item.name}</ListItemText>
              </ListItemButton>
            </ListItem>
          ))}
        </List> */}
        <Grid2
          container
          spacing={2}
          columns={{ xs: 1, md: 2 }}
          justifyContent="stretch"
        >
          {repositories.map((repo) => {
            const params = createSearchParams({
              path: repo.path,
            });
            const search = `?${params}`;
            console.debug(repo.description);
            return (
              <Grid2
                key={repo.path}
                size={1}
              >
                <Card>
                  <CardActionArea
                    disableRipple
                    disableTouchRipple
                    component={Link}
                    to={{
                      pathname: "/dir",
                      search,
                    }}
                  >
                    <CardHeader title={repo.name} />
                    {repo.description !== null && (
                      <CardContent>
                        <Typography>
                          {repo.description}
                        </Typography>
                      </CardContent>
                    )}
                  </CardActionArea>
                </Card>
              </Grid2>
            );
          })}
        </Grid2>
      </Box>
    </Container>
  );
};
