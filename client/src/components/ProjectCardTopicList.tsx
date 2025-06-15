import type { ProjectTopic } from "@/types/projects/project.entity";
import { Stack, Typography } from "@mui/material";
import type { FC } from "react";
import { StyledLink } from "./StyledLink";

type Props = {
  items: ProjectTopic[];
};
export const ProjectCardTopicList: FC<Props> = ({ items }) => {
  return (
    <Stack
      direction="row"
      spacing={2}
      useFlexGap
      flexWrap="wrap"
      alignItems="baseline"
    >
      <Typography color="textSecondary">{`Topics:`}</Typography>
      {items.length === 0 && (
        <Typography sx={{ width: "fit-content" }} color="textSecondary">
          {`None`}
        </Typography>
      )}
      {items.map(({ id, name }) => (
        <StyledLink
          key={`item-${id}`}
          search={{ technologies: [name] }}
          color="textSecondary"
          to="/projects"
          sx={{ width: "fit-content" }}
        >
          {name}
        </StyledLink>
      ))}
    </Stack>
  );
};
