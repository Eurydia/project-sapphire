import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
} from "@mui/material";
import { FC, useState } from "react";
import { useSubmit } from "react-router";

export const HomeStartupView: FC = () => {
  const [path, setPath] = useState("");
  const submit = useSubmit();
  const handleSubmit = () => {
    submit({ path }, { action: ".", method: "post" });
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ padding: 4 }}>
        <Stack
          spacing={1}
          justifyContent="start"
        >
          <TextField
            value={path}
            onChange={(e) => setPath(e.target.value)}
            slotProps={{
              htmlInput: {
                sx: { fontFamily: "monospace" },
              },
            }}
          />
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{ width: "fit-content" }}
          >
            submit
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};
