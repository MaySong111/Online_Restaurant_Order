// features/auth/NotFoundPage.jsx
import { Container, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/routes";

export default function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ mt: 10, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Access Denied
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        You do not have permission to view this page.
      </Typography>
      <Box mt={4}>
        <Button variant="contained" onClick={() => navigate(ROUTES.MENUS)}>
          Back to Home
        </Button>
      </Box>
    </Container>
  );
}
