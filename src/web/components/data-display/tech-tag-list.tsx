import { Chip, Stack, darken, useTheme } from "@mui/material";
import { memo, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import type { FC } from "react";
import type { Technology } from "@/web/models/technologies/technologies";

type Props = {
  items: Array<Technology>;
};
export const TechTagList: FC<Props> = memo(({ items }) => {
  const {
    palette,
    typography: { monospaceFontFamily },
  } = useTheme();
  const navigate = useNavigate();

  const onClickHandleProvider = useCallback(
    (uuid: string) => () => {
      navigate({ to: "/technologies", hash: uuid });
    },
    [navigate]
  );
  if (items.length === 0) {
    return null;
  }
  return (
    <Stack spacing={1} direction="row">
      {items.map(({ uuid, name, color }, index) => (
        <Chip
          key={`tag-item[${index}]`}
          sx={{
            cursor: "pointer",
            backgroundColor: color,
            color: palette.getContrastText(color),
            "&:hover": {
              backgroundColor: darken(color, 0.5),
              color: palette.getContrastText(darken(color, 0.5)),
            },
            fontFamily: monospaceFontFamily,
          }}
          component="div"
          onClick={onClickHandleProvider(uuid)}
          label={name}
        />
      ))}
    </Stack>
  );
});
