import type { AutocompleteChangeReason } from "@mui/material"
import { Autocomplete, TextField } from "@mui/material"
import type { FC } from "react"
import { memo, useCallback, useMemo, useState } from "react"

type Props = {
  onSelect: (value: string) => unknown
  placeholder?: string
  options: Array<string>
  disabledOptions: Array<string>
  onBlur: () => unknown
}
export const AutocompleteTextField: FC<Props> = memo(
  ({
    onBlur,
    onSelect,
    placeholder,
    options,
    disabledOptions,
  }) => {
    const [value, setValue] = useState("")
    const [inputValue, setInputValue] = useState("")

    const disabledOptionsSet = useMemo(() => {
      return new Set(disabledOptions)
    }, [disabledOptions])

    const handleChange = useCallback(
      (
        _: unknown,
        v: string | null,
        reason: AutocompleteChangeReason,
      ) => {
        if (v === null) {
          return
        }
        if (
          v.trim() === "" ||
          disabledOptionsSet.has(v.trim())
        ) {
          return
        }
        if (
          reason === "createOption" ||
          reason === "selectOption"
        ) {
          onSelect(v)
          setInputValue("")
          setValue("")
        }
      },
      [onSelect, disabledOptionsSet],
    )

    const handleInputChange = useCallback(
      (_: unknown, v: string) => {
        setInputValue(v)
      },
      [],
    )

    const getDisabledOptions = useCallback(
      (opt: string) => {
        return disabledOptionsSet.has(opt)
      },
      [disabledOptionsSet],
    )

    return (
      <Autocomplete
        freeSolo
        disableClearable
        value={value}
        inputValue={inputValue}
        onChange={handleChange}
        onInputChange={handleInputChange}
        fullWidth
        renderInput={(params) => (
          <TextField {...params} placeholder={placeholder} />
        )}
        options={options}
        getOptionDisabled={getDisabledOptions}
        onBlur={onBlur}
      />
    )
  },
)
