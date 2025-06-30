import type { ProjectTree } from "@/types/project-tree/project-tree.entity";
import {
  FolderRounded,
  MoreVertRounded,
  WarningAmberRounded,
} from "@mui/icons-material";
import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import moment from "moment";
import type { FC } from "react";
import { StyledLink } from "./StyledLink";

type Props = {
  projectUUID: string;
  tree: ProjectTree | null;
};
export const ProjectTreeTable: FC<Props> = ({ projectUUID, tree }) => {
  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>{`Name`}</TableCell>
            <TableCell>{`Modified`}</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {tree === null && (
            <TableRow
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell>
                <WarningAmberRounded />
              </TableCell>
              <TableCell colSpan={3}>{"Unable to read directory"}</TableCell>
            </TableRow>
          )}
          {tree !== null &&
            tree.directories.length === 0 &&
            tree.files.length === 0 && (
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell colSpan={4}>{"Directory is empty"}</TableCell>
              </TableRow>
            )}
          {tree !== null &&
            tree.directories.map(({ name, path, metadata }, index) => {
              return (
                <TableRow
                  key={`row-dir-${index}`}
                  hover
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell padding="checkbox">
                    <FolderRounded color="primary" fontSize="small" />
                  </TableCell>
                  <TableCell>
                    <StyledLink
                      to={`/projects/$projectId/tree/$`}
                      params={{
                        projectId: projectUUID,
                        _splat: path,
                      }}
                    >
                      {name}
                    </StyledLink>
                  </TableCell>
                  <TableCell>{moment(metadata.modifiedAt).fromNow()}</TableCell>
                  <TableCell>
                    <IconButton>
                      <MoreVertRounded />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          {tree !== null &&
            tree.files.map(({ name, path, metadata }, index) => {
              return (
                <TableRow
                  key={`row-file-${index}`}
                  hover
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell padding="checkbox" />
                  <TableCell>
                    <StyledLink
                      to="/projects/$projectId/blob/$"
                      params={{ projectId: projectUUID, _splat: path }}
                    >
                      {name}
                    </StyledLink>
                  </TableCell>
                  <TableCell>{moment(metadata.modifiedAt).fromNow()}</TableCell>
                  <TableCell>
                    <IconButton>
                      <MoreVertRounded />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
