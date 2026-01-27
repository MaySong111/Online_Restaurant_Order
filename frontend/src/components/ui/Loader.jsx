// components/ui/Loader.jsx
import { Box, CircularProgress } from "@mui/material";

export default function Loader() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="400px"
    >
      <CircularProgress size={60} />
    </Box>
  );
}