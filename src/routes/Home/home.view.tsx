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
import { FC } from "react";
import {
  createSearchParams,
  Link,
  useLoaderData,
} from "react-router";
import { StyledLink } from "../../components/StyledLink";
import { HomeLoaderData } from "./home.entity";

export const HomeView: FC = () => {
  const { data }: HomeLoaderData = useLoaderData();
  const { name, repositories } = data;
  return (
    <Container maxWidth="lg">
      <Box sx={{ padding: 4 }}>
        <Toolbar disableGutters>
          <Breadcrumbs>
            <StyledLink to="/">{name}</StyledLink>
          </Breadcrumbs>
        </Toolbar>
        <List>
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
