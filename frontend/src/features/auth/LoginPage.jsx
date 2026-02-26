// features/auth/LoginPage.jsx
import { useState } from "react";
import {
  Container,
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Link,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../../store/authStore";
import { ROUTES } from "../../constants/routes";
import useAuth from "../../hooks/useAuth";

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [loading, setLoading] = useState(false);
  const { loginMutation } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await loginMutation.mutateAsync(formData);
      // console.log("Login response:", response);
      login(response.data.token);
      navigate(ROUTES.MENUS);
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 8 }}>
      <Typography variant="body2" color="text.secondary">
        🔑 Demo Account | Email: Admin1@admin.com / Password:Admin1@admin.com |
        Or register a new account as Customer
      </Typography>
      <Box display="flex" gap={4}>
        <Box
          width="50%"
          component="img"
          src="/assets/1.jpg"
          alt="Login"
          sx={{ borderRadius: 2, objectFit: "cover", maxHeight: 500 }}
        />

        <Paper elevation={3} sx={{ width: "50%", p: 4 }}>
          <Typography variant="h4" gutterBottom>
            Sign In
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              margin="normal"
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              margin="normal"
            />

            {error && (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}

            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 3 }}
            >
              {loading ? <CircularProgress size={24} /> : "Login"}
            </Button>
          </form>

          <Box mt={2} textAlign="center">
            <Typography variant="body2">
              Don't have an account?{" "}
              <Link
                component="button"
                onClick={() => navigate(ROUTES.REGISTER)}
                sx={{ cursor: "pointer" }}
              >
                Sign up
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
