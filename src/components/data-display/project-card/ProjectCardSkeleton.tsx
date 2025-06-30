import { Paper, Skeleton, Stack, Typography } from "@mui/material";
import type { FC } from "react";

export const ProjectCardSkeleton: FC = () => (
  <Paper variant="outlined" sx={{ padding: 2 }}>
    <Stack spacing={2}>
      <Typography variant="h4" component="div">
        <Skeleton width="15ch" />
      </Typography>
      <Typography component="div">
        <Skeleton width="60ch" />
      </Typography>
      <Typography component="div">
        <Skeleton width="36ch" />
      </Typography>
    </Stack>
  </Paper>
);
