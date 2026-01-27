// features/profile/ProfilePage.jsx
import { useEffect, useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Paper,
  Grid,
  FormControlLabel,
  Checkbox,
  CircularProgress,
} from "@mui/material";
import { CameraAlt, CheckBox } from "@mui/icons-material";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import { Roles } from "../../constants/constants";
import { useParams } from "react-router-dom";
import useAuthStore from "../../../store/authStore";
import { BASE_URL } from "../../constants/api";
import { useQueryClient } from "@tanstack/react-query";

export default function UserManagementPage() {
  const queryClient = useQueryClient();
  const loggedInUser = useAuthStore((state) => state.user);
  const { userId } = useParams();
  const { userInfo, isUserInfoLoading, updateUserMutation } = useAuth(userId);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    role: Roles.USER,
    file: null,
  });
  const [avatarPreview, setAvatarPreview] = useState(
    "/images/defaultAvatar.png",
  );

  useEffect(() => {
    if (userInfo) {
      setFormData({
        name: userInfo.name || "",
        email: userInfo.email || "",
        phoneNumber: userInfo.phoneNumber || "",
        address: userInfo.address || "",
        role: userInfo.role || Roles.USER,
        file: null,
      });
      if (userInfo?.imageUrl) {
        setAvatarPreview(
          `${BASE_URL.replace("/api", "")}/${userInfo.imageUrl}`,
        );
      }
    }
  }, [userInfo]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]:
        type === "checkbox" ? (checked ? Roles.ADMIN : Roles.USER) : value,
    });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFormData({ ...formData, file });
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.name?.trim() &&
      !formData.phoneNumber?.trim() &&
      !formData.address?.trim() &&
      !formData.file
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const formUpdateData = new FormData();
    formUpdateData.append("name", formData.name);
    formUpdateData.append("phoneNumber", formData.phoneNumber);
    formUpdateData.append("address", formData.address);
    formUpdateData.append("role", formData.role);
    if (formData.file) formUpdateData.append("file", formData.file);

    updateUserMutation.mutate(
      { userId, formUpdateData },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(["userInfo", loggedInUser.id]);
          toast.success("User updated successfully");
        },
      },
    );
  };

  if (isUserInfoLoading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Box display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap={2}
              sx={{
                p: 3,
                backgroundColor: "action.hover",
                borderRadius: 2,
              }}
            >
              <Avatar
                src={avatarPreview}
                sx={{
                  width: 120,
                  height: 120,
                  fontSize: "3rem",
                  bgcolor: "success.main",
                }}
              >
                {userInfo?.name?.charAt(0).toUpperCase()}
              </Avatar>
              <Button
                variant="outlined"
                component="label"
                startIcon={<CameraAlt />}
                size="small"
              >
                Upload Photo
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </Button>
              <Typography
                variant="caption"
                color="text.secondary"
                textAlign="center"
              >
                JPG, PNG or JPEG (Max 2MB)
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                margin="normal"
              />
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                margin="normal"
                disabled
              />
              <TextField
                fullWidth
                label="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                multiline
                rows={2}
                margin="normal"
              />
              {loggedInUser?.role === Roles.ADMIN && (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.role === Roles.ADMIN}
                      onChange={handleChange}
                      name="role"
                    />
                  }
                  label="Admin"
                />
              )}
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                sx={{ mt: 3 }}
              >
                Save Changes
              </Button>
            </form>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}
