import type {
  AutocompleteChangeReason,
  FilterOptionsState,
} from "@mui/material"
import { Autocomplete, TextField } from "@mui/material"
import { uniq } from "lodash"
import { matchSorter } from "match-sorter"
import type { FC } from "react"
import { memo, useCallback, useMemo, useState } from "react"

type Props = {
  onSelect: (value: string) => unknown
  placeholder?: string
  options: Array<string>
  disabledOptions: Array<string>
  onBlur: () => unknown
  error?: boolean
}
export const AutocompleteTextField: FC<Props> = memo(
  ({
    error,
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
    const filterOptions = (
      options: string[],
      state: FilterOptionsState<string>,
    ) => {
      return uniq(
        state.inputValue
          .split(" ")
          .reduceRight(
            (results, term) => matchSorter(results, term),
            options,
          ) satisfies string[],
      )
    }

    return (
      <Autocomplete
        freeSolo
        disableClearable
        value={value}
        filterOptions={filterOptions}
        inputValue={inputValue}
        onChange={handleChange}
        onInputChange={handleInputChange}
        fullWidth
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={placeholder}
            error={error}
          />
        )}
        options={uniq(options)}
        getOptionDisabled={getDisabledOptions}
        onBlur={onBlur}
      />
    )
  },
)
