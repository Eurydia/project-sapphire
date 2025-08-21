import { FileSystemService } from "@/api/file-system.service"
import { Stack, TextField } from "@mui/material"
import { isRight } from "fp-ts/lib/Either"
import { useRef, type FC } from "react"
import { TypographyButton } from "./typography-button"

type Props = {
  value: string
  onChange: (value: string) => unknown
  onBlur?: () => unknown
  error?: boolean
}
export const DirectoryInput: FC<Props> = ({
  value,
  onChange,
  onBlur,
  error,
}) => {
  const dialogActiveRef = useRef(false)

  return (
    <Stack direction="row" flexWrap="wrap" spacing={2}>
      <TextField
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        fullWidth
        error={error}
      />
      <TypographyButton
        onClick={async () => {
          if (dialogActiveRef.current) {
            return
          }
          dialogActiveRef.current = true
          await FileSystemService.openDirDialog()
            .then((result) => {
              if (isRight(result)) {
                const { filePaths, canceled } = result.right
                const path = filePaths.at(0)
                if (!canceled && path !== undefined) {
                  onChange(path)
                }
              }
            })
            .finally(() => (dialogActiveRef.current = false))
        }}
      >
        [OPEN EXPLORER]
      </TypographyButton>
    </Stack>
  )
}
