import { TextField, type TextFieldProps } from "@mui/material";
import {
  memo,
  useCallback,
  type ChangeEvent,
  type FC,
  type KeyboardEvent,
} from "react";

type Props = {
  fullWidth?: boolean;
  value: string;
  onChange: (value: string) => unknown;
  onBlur?: () => unknown;
  placeholder?: string;
  error?: boolean;
  minRow?: number;
  size?: TextFieldProps["size"];
  onSubmit?: (value: string) => unknown;
};
export const TextInput: FC<Props> = memo(
  ({
    size,
    minRow,
    fullWidth,
    onChange,
    value,
    placeholder,
    onBlur,
    error,
    onSubmit,
  }) => {
    const handleChange = useCallback(
      (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        onChange(e.target.value);
      },
      [],
    );

    const handleKeyUp = useCallback(
      (e: KeyboardEvent<HTMLDivElement>) => {
        if (onSubmit === undefined) {
          return;
        }
        if (e.key === "enter") {
          onSubmit(value);
        }
      },
      [onSubmit, value],
    );

    return (
      <TextField
        onKeyUp={handleKeyUp}
        size={size}
        variant="outlined"
        multiline={minRow !== undefined}
        minRows={minRow}
        fullWidth={fullWidth}
        value={value}
        error={error}
        onBlur={onBlur}
        onChange={handleChange}
        placeholder={placeholder}
      />
    );
  },
);
