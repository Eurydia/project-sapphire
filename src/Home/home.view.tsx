import { Masonry } from "@mui/lab";
import {
  Card,
  CardActionArea,
  CardHeader,
  Container,
  Typography,
} from "@mui/material";
import { FC } from "react";
import { Link, useLoaderData } from "react-router";
import { HomeLoaderData } from "./home.entity";

export const HomeView: FC = () => {
  const { repositories }: HomeLoaderData = useLoaderData();
  return (
    <Container maxWidth="md">
      <Typography>Hi</Typography>
      <Masonry columns={{ xs: 1, md: 3 }}>
        {repositories.map((item, index) => (
          <Card key={"item" + index}>
            <CardActionArea
              component={Link}
              to={`repository/${item.name}`}
            >
              <CardHeader title={item.name} />
            </CardActionArea>
          </Card>
        ))}
      </Masonry>
    </Container>
  );
};
