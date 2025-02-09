import { Masonry } from "@mui/lab";
import {
  Card,
  CardHeader,
  Container,
  Typography,
} from "@mui/material";
import { FC } from "react";
import { useLoaderData } from "react-router";
import { RepositoryLoaderData } from "./repository.entity";

export const RepositoryView: FC = () => {
  const { directories, files, path }: RepositoryLoaderData =
    useLoaderData();
  return (
    <Container maxWidth="md">
      <Typography>{path}</Typography>
      <Masonry columns={{ xs: 1, md: 2 }}>
        {files.map((item, index) => (
          <Card key={"item" + index}>
            <CardHeader
              title={item}
              subheader="files"
              slotProps={{
                title: {
                  sx: {
                    width: "100%",
                    whiteSpace: "break-spaces",
                    wordBreak: "break-all",
                  },
                },
              }}
            />
          </Card>
        ))}
      </Masonry>
      <Masonry columns={{ xs: 1, md: 2 }}>
        {directories.map((item, index) => (
          <Card key={"item" + index}>
            <CardHeader
              title={item}
              subheader="dir"
            />
          </Card>
        ))}
      </Masonry>
    </Container>
  );
};
