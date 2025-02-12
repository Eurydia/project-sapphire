import {
  CheckBoxOutlineBlankRounded,
  CheckBoxRounded,
  FolderRounded,
} from "@mui/icons-material";
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
  TextField,
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
import { createVaultCollection } from "./home.service";

export const HomeView: FC = () => {
  const { data }: HomeLoaderData = useLoaderData();
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
        {Object.entries(config.collections)
          .toSorted(([a], [b]) => a.localeCompare(b))
          .map(([name, repos], index) => (
            <List
              key={"collection" + index}
              subheader={name}
            >
              {repos.map((repo, reIndex) => (
                <ListItem
                  key={
                    "collection" + index + "repo" + reIndex
                  }
                >
                  <ListItemText>{repo}</ListItemText>
                </ListItem>
              ))}
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
        </List>
        <List
          subheader={
            <Typography fontFamily="monospace">
              All repositories
            </Typography>
          }
        >
          {repositories.map((item, index) => {
            const params = createSearchParams({
              path: item.path,
            });
            const search = `?${params}`;
            return (
              <ListItem
                key={"item" + index}
                divider
                disablePadding
              >
                <ListItemButton
                  disableRipple
                  disableTouchRipple
                  component={Link}
                  to={{ pathname: `/dir`, search }}
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
        </List>
      </Box>
    </Container>
  );
};
