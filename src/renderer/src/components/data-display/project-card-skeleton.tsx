import { Paper, Skeleton, Stack, Typography } from "@mui/material";
import type { FC } from "react";
import { memo } from "react";

export const ProjectCardSkeleton: FC = memo(() => {
  return (
    <Paper variant="outlined">
      <Stack spacing={1}>
        <Typography variant="h5" sx={{ width: { md: "20%" } }}>
          <Skeleton />
        </Typography>
        <Typography>
          <Skeleton />
        </Typography>
        <Typography>
          <Skeleton />
        </Typography>
        <Typography sx={{ width: { md: "75%" } }}>
          <Skeleton />
        </Typography>
      </Stack>
    </Paper>
  );
});
