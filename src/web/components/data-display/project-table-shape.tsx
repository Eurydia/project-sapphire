import {
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { memo, Suspense, use, type FC } from "react";
import { getProjectTableShape } from "~/api/db/projects";

type InnerProps = { fetcher: ReturnType<typeof getProjectTableShape> };
const Inner: FC<InnerProps> = memo(({ fetcher }) => {
  const tableShape = use(fetcher);

  if (tableShape === null) {
    return (
      <Alert severity="error">{`failed to load project table shape`}</Alert>
    );
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{`name`}</TableCell>
            <TableCell>{`type`}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tableShape.columns.map((col, index) => (
            <TableRow key={`c-${index}`}>
              <TableCell>{col.name}</TableCell>
              <TableCell>{col.type}</TableCell>
            </TableRow>
          ))}
          {tableShape.relations.map((col, index) => (
            <TableRow key={`r-${index}`}>
              <TableCell>{col.name}</TableCell>
              <TableCell>{col.type}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    // <List dense disablePadding>
    //   <List
    //     dense
    //     disablePadding
    //     subheader={
    //       <ListSubheader disableGutters disableSticky>
    //         {`Columns`}
    //       </ListSubheader>
    //     }
    //   >
    //     {tableShape.columns.map((col, index) => (
    //       <ListItem dense disableGutters disablePadding key={`i-${index}`}>
    //         <ListItemText primary={col.name} secondary={col.type} />
    //       </ListItem>
    //     ))}
    //   </List>
    //   <List
    //     dense
    //     disablePadding
    //     subheader={
    //       <ListSubheader disableGutters disableSticky>
    //         {`Relations`}
    //       </ListSubheader>
    //     }
    //   >
    //     {tableShape.relations.map((col, index) => (
    //       <ListItem dense disableGutters disablePadding key={`i-${index}`}>
    //         <ListItemText primary={col.name} secondary={col.type} />
    //       </ListItem>
    //     ))}
    //   </List>
    // </List>
  );
});

export const ProjectTableShape: FC = memo(() => {
  return (
    <Suspense>
      <Inner fetcher={getProjectTableShape()} />
    </Suspense>
  );
});
