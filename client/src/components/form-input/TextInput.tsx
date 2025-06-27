import { TextField, type TextFieldProps } from "@mui/material";
import { memo, useCallback, type ChangeEvent, type FC } from "react";

type Props = {
  fullWidth?: boolean;
  value: string;
  onChange: (value: string) => unknown;
  onBlur?: () => unknown;
  placeholder?: string;
  error?: boolean;
  minRow?: number;
  size?: TextFieldProps["size"];
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
  }) => {
    const handleChange = useCallback(
      (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        onChange(e.target.value);
      },
      [],
    );

    return (
      <TextField
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
