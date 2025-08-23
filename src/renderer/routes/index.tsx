import { FileSystemService } from "@/api/file-system.service"
import { TypographyButton } from "@/components/input/typography-button"
import { StyledLink } from "@/components/navigation/styled-link"
import {
  Divider,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material"
import { createFileRoute } from "@tanstack/react-router"

const RouteComponent = () => {
  return (
    <Stack spacing={1}>
      <Paper>
        <Stack spacing={2}>
          <TypographyButton
            onClick={() => FileSystemService.openDbPath()}
          >
            [OPEN DB]
          </TypographyButton>
          <Divider />
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>NAME</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>
                  <StyledLink to="/projects">{`[PROJECTS]`}</StyledLink>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <StyledLink to="/project-tags">{`[PROJECT TAGS]`}</StyledLink>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Stack>
      </Paper>
    </Stack>
  )
}

export const Route = createFileRoute("/")({
  component: RouteComponent,
})
