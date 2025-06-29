import { Chip, Skeleton, Stack, Typography } from "@mui/material";
import { memo, Suspense, useCallback, type FC } from "react";
import { AutocompleteAsync } from "./AutocompleteAsync";

type Props = {
  placeholder?: string;
  items: string[];
  optionsPromise: Promise<string[]>;
  onAdd: (v: string) => unknown;
  onRemove: (index: number) => unknown;
};
export const TagInput: FC<Props> = memo(
  ({ placeholder, items, onAdd, onRemove, optionsPromise }) => {
    const deleteHandleProvider = useCallback(
      (index: number) => () => {
        onRemove(index);
      },
      [onRemove],
    );

    return (
      <Stack spacing={0.5}>
        <Suspense fallback={<Skeleton variant="rectangular" />}>
          <AutocompleteAsync
            placeholder={placeholder}
            items={items}
            optionsPromise={optionsPromise}
            onChange={onAdd}
          />
        </Suspense>
        <Stack flexDirection="row" gap={0.5} useFlexGap flexWrap="wrap">
          {items.map((item, index) => (
            <Chip
              key={`tag-items[${index}]`}
              label={<Typography>{item}</Typography>}
              sx={{ width: "fit-content" }}
              onDelete={deleteHandleProvider(index)}
            />
          ))}
        </Stack>
      </Stack>
    );
  },
);
