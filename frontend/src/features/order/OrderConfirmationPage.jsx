// features/order/OrderConfirmationPage.jsx
import {
  Container,
  Box,
  Paper,
  Typography,
  Button,
  Alert,
} from "@mui/material";
import { CheckCircle } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { format } from "date-fns";

export default function OrderConfirmationPage() {
  const navigate = useNavigate();
  const currentDate = format(new Date(), "MM/dd/yyyy");

  return (
    <Container maxWidth="md" sx={{ mt: 8, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box textAlign="center" mb={4}>
          <CheckCircle sx={{ fontSize: 80, color: "success.main", mb: 2 }} />
          <Alert severity="success" sx={{ mb: 3 }}>
            <Typography variant="h6">
              Thank you! Your order has been confirmed.
            </Typography>
          </Alert>

          <Typography variant="body1" gutterBottom>
            <strong>Date:</strong> {currentDate}
          </Typography>
        </Box>

        <Typography
          variant="body1"
          textAlign="center"
          color="text.secondary"
        >
          We are excited to prepare your order! Please allow us at least 30
          minutes to ensure everything is freshly made and ready for pickup.
        </Typography>

        <Box textAlign="center" mt={4}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate(ROUTES.MENUS)}
          >
            Back to Menu
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
