import { FolderRounded } from "@mui/icons-material";
import {
  Container,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { FC } from "react";
import { useLoaderData } from "react-router";
import { RepositoryLoaderData } from "./repository.entity";

export const RepositoryView: FC = () => {
  const { directories, files, path }: RepositoryLoaderData =
    useLoaderData();
  return (
    <Container maxWidth="md">
      <List subheader={path}>
        {directories.map((item, index) => (
          <ListItem key={"item" + index}>
            <ListItemIcon>
              <FolderRounded />
            </ListItemIcon>
            <ListItemText primary={item} />
          </ListItem>
        ))}
      </List>
      {files.map((item, index) => (
        <ListItem key={"item" + index}>
          <ListItemIcon />
          <ListItemText primary={item} />
        </ListItem>
      ))}
    </Container>
  );
};
