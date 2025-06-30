import {
  Autocomplete,
  TextField,
  type AutocompleteChangeReason,
  type AutocompleteInputChangeReason,
} from "@mui/material";
import {
  memo,
  use,
  useCallback,
  useMemo,
  useState,
  type FC,
  type SyntheticEvent,
} from "react";

type Props = {
  error?: boolean;
  placeholder?: string;
  items: string[];
  optionsPromise: Promise<string[]>;
  onChange: (v: string) => unknown;
};
export const AutocompleteAsync: FC<Props> = memo(
  ({ error, placeholder, items, onChange, optionsPromise }) => {
    const options = use(optionsPromise);
    const [inputValue, setInputValue] = useState("");
    const handleChange = useCallback(
      (_: SyntheticEvent, v: string | null, r: AutocompleteChangeReason) => {
        if (v === null) {
          return;
        }
        if (r === "createOption" || r === "selectOption") {
          onChange(v);
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
      <Autocomplete
        disableClearable
        freeSolo
        clearOnEscape
        getOptionDisabled={getOptionDisabled}
        renderInput={(params) => (
          <TextField
            {...params}
            error={error}
            variant="outlined"
            placeholder={placeholder}
          />
        )}
        slotProps={{ paper: { elevation: 4 } }}
        options={options}
        inputValue={inputValue}
        onChange={handleChange}
        onInputChange={handleInputChange}
      />
    );
  },
);
