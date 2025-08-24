import { FileSystemService } from "@/api/file-system.service"
import {
  Stack,
  TextField,
  type TextFieldProps,
} from "@mui/material"
import { isRight } from "fp-ts/lib/Either"
import { useRef, type FC } from "react"
import { TypographyButton } from "./typography-button"

type Props = {
  value: string
  onChange: (v: string) => unknown
} & Omit<TextFieldProps, "value" | "onChange">
export const TextFieldFileContentInput: FC<Props> = ({
  onChange,
  value,
  ...rest
}) => {
  const dialogActiveRef = useRef(false)

  return (
    <Stack spacing={1}>
      <TypographyButton
        onClick={async () => {
          if (dialogActiveRef.current) {
            return
          }
          dialogActiveRef.current = true
          const result =
            await FileSystemService.readFileContent().finally(
              () => {
                dialogActiveRef.current = false
              },
            )
          if (isRight(result) && result.right !== null) {
            onChange(result.right)
          }
        }}
      >
        [IMPORT FROM FILE]
      </TypographyButton>
      <TextField
        {...rest}
        onChange={(e) => onChange(e.target.value)}
        value={value}
      />
    </Stack>
  )
}
