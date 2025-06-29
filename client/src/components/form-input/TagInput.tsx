import {
  Autocomplete,
  Chip,
  Stack,
  TextField,
  Typography,
  type AutocompleteChangeReason,
  type AutocompleteInputChangeReason,
} from "@mui/material";
import {
  memo,
  useCallback,
  useMemo,
  useState,
  type FC,
  type SyntheticEvent,
} from "react";

type Props = {
  placeholder?: string;
  items: string[];
  options: string[];
  onAdd: (v: string) => unknown;
  onRemove: (index: number) => unknown;
};
export const TagInput: FC<Props> = memo(
  ({ placeholder, items, onAdd, onRemove, options }) => {
    const [inputValue, setInputValue] = useState("");
    const handleChange = useCallback(
      (_: SyntheticEvent, v: string | null, r: AutocompleteChangeReason) => {
        if (v === null) {
          return;
        }
        if (r === "createOption" || r === "selectOption") {
          onAdd(v);
          setInputValue("");
        }
      },
      [],
    );

    const handleInputChange = useCallback(
      (_: unknown, v: string, r: AutocompleteInputChangeReason) => {
        if (r === "selectOption") {
          setInputValue("");
        } else if (r === "input") {
          setInputValue(v);
        }
      },
      [],
    );

    const deleteHandlerProvider = useCallback(
      (index: number) => () => {
        onRemove(index);
      },
      [],
    );

    const itemsSet = useMemo(() => {
      return new Set(items);
    }, [items]);

    const getOptionDisabled = useCallback(
      (opt: string) => {
        return itemsSet.has(opt);
      },
      [itemsSet],
    );

    return (
      <Stack spacing={0.5}>
        <Autocomplete
          disableClearable
          freeSolo
          clearOnEscape
          getOptionDisabled={getOptionDisabled}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              placeholder={placeholder}
            />
          )}
          slotProps={{ paper: { variant: "outlined" } }}
          options={options}
          inputValue={inputValue}
          onChange={handleChange}
          onInputChange={handleInputChange}
        />
        <Stack flexDirection="row" gap={0.5} useFlexGap flexWrap="wrap">
          {items.map((item, index) => (
            <Chip
              key={`tag-items[${index}]`}
              label={<Typography>{item}</Typography>}
              sx={{ width: "fit-content" }}
              onDelete={deleteHandlerProvider(index)}
            />
          ))}
        </Stack>
      </Stack>
    );
  },
);
